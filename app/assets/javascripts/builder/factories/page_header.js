builderApp.factory('PageHeader',function($http){
    var PageHeader = function(devicePage){
      //TODO null check for device page
      this.devicePage = devicePage;
      this.jQuery = null;
      this.pageContents = null;
      this.data = null;
      console.log("Setting up page header");
    }
    PageHeader.prototype.load = function(page_uniq_id,jquery,pageContents,data,cb){
      if(this.data !== null || this.data != undefined){
        console.log("Header already has data");
        alert('A header already exists. Try Deleting it and readd a new header');
        cb(null);
        return;
      }
      if(nullOrUndefined(data)){
        console.log('Header data is undefined');

        cb(null);
        return;
      }
      //TODO check if the headerHtml is already present
      //this should not really happen that data is not present and the header html is present
      // but we need to check to be sure
      this.jQuery  = jquery;
      this.pageContents = pageContents;
      this.data = data;
      this.page_uniq_id = page_uniq_id;
      this.redrawWidget();
      //this.setupControls();
      cb(); 
    }
    PageHeader.prototype.destroyWidget = function() {
      this.pageContents.find('[data-bg-uniq-id="' + this.data.bg_uniq_id +'"]').remove();
      this.jQuery('[data-bg-uniq-id="' + this.page_uniq_id +'"]').removeClass('ui-page-header-fixed');
      this.jQuery('[data-bg-uniq-id="' + this.page_uniq_id +'"]').css('padding-top','');
    };
    PageHeader.prototype.redrawWidget = function() {
      this.destroyWidget();
      this.pageContents.find('[data-bg-uniq-id="' + this.page_uniq_id +'"]').prepend(getHeaderHtml(this.data));
      this.jQuery(this.pageContents.find('[data-role="header"]')).toolbar();

    };
    PageHeader.prototype.insertNewLinkButton = function(align) {
      var self = this;
      if(align === undefined || align === null){
        console.log("TODO align is null")
        return;
      }
      if(align !== 'left' && align !== 'right'){
        console.log("TODO insertNewLinkButton align is neither left nor right");
        return;
      }

      var newLinkButtonJSON = getNewLinkButtonJSON(align);
     
      self.devicePage.addWidget(newLinkButtonJSON);

      //TODO more intelligent ?
      if(align === 'left'){
        //TODO make sure that left is null here
        self.data.left = newLinkButtonJSON;
      } else {
        self.data.right = newLinkButtonJSON;
      }
      self.redrawWidget();
      self.setupControls();
      
    };
    PageHeader.prototype.insertNewHeading = function() {
      var self = this;
      

      var newHeaderHeading = getNewHeaderHeadingJSON();
     
      self.devicePage.addWidget(newHeaderHeading);

      self.data.center = newHeaderHeading
      self.redrawWidget();
      self.setupControls();
      
    };

    PageHeader.prototype.setupControls = function(){
     var self = this;
     if (nullOrUndefined(self.data) === true){
      return;
     }
     self.pageContents.find('[data-bg-uniq-id="' + self.data.bg_uniq_id +'"]').click(function(event){
       event.stopPropagation();
       console.log(self.data);
       self.devicePage.activateWidget(self.data.bg_uniq_id);
     });
     self.pageContents.find( 'body .bgcontrol_click' ).click(function(event){
       event.stopPropagation();
       event.preventDefault();
       //TODO a click event is fired and the widget hasnt been added yet, so error occurs
       console.log("Activating with");
       console.log($(this).attr('data-bg-uniq-id'));

       self.devicePage.activateWidget($(this).attr('data-bg-uniq-id'));
     });
      self.pageContents.find( 'body .dummy' ).click(function(event){
       event.stopPropagation();
       event.preventDefault();
       self.devicePage.activateWidget(self.data.bg_uniq_id);

     });
     self.pageContents.find('body .bgcontrol_click, body .dummy').hover(function() {
           $(this).addClass("hover_highlight");
     }, function() {
           $(this).removeClass("hover_highlight");
     });
      self.pageContents.find('body .dummy').click(function(event) {
        event.stopPropagation();
        event.preventDefault();
     });
     self.pageContents.find( 'body .bgcontrol_click' ).droppable({
      /*
      drop: function( event, ui ) {
        ALREADY_DROPPED = true;
        console.log("dropped");
      },*/
      greedy:true,
      over: function(event,ui){
        $(this).addClass("hover_highlight");
      
        DRAG_DATA = getDragData(this);

      },
      out: function(event,ui){
        $(this).removeClass("hover_highlight");
        self.jQuery(this).find('.shim').remove(); 
        DRAG_DATA = null;
      }
      });

      self.pageContents.find('.dummy').droppable({
       /* drop: function( event, ui ) {
        //ALREADY_DROPPED = true;
        console.log("dropped on dumm");
        var class_str = $(this).attr('class');
        if(class_str !== null && class_str !== undefined){
          if(class_str.indexOf('ui-btn-left') != -1){
            self.insertNewLinkButton('left')  
          } else if(class_str.indexOf('ui-btn-right') != -1){
            self.insertNewLinkButton('right');
          } else {
            console.log("TODO_should_not_happen");
          }
        }

        
      },*/
      greedy:true,
      over: function(event,ui){
        $(this).addClass("hover_highlight");
        DRAG_DATA = getDragData(this);
        ALREADY_DROPPED = true;
      },
      out: function(event,ui){
        $(this).removeClass("hover_highlight");
        self.jQuery(this).find('.shim').remove(); 
        ALREADY_DROPPED = false;
        DRAG_DATA = null;
      }
      });


      
    }
    PageHeader.prototype.unsetControls = function() {
     var self = this;
     self.pageContents.find('[data-bg-uniq-id="' + self.data.bg_uniq_id +'"]').off('click');
     self.pageContents.find( 'body .bgcontrol_click' ).off('click');
     self.pageContents.find('body .bgcontrol_click, body .dummy').off('hover');

     self.pageContents.find('body .dummy').off('click');
     self.pageContents.find( 'body .bgcontrol_click' ).droppable().droppable('destroy');

    };
    PageHeader.prototype.hasWidget = function(widgetData) {
      var self = this;
      if(nullOrUndefined(self.data) === true){
        return;
      }
      if(widgetData === null || widgetData === undefined){
        return false;
      }
      if(widgetData.bg_uniq_id === null || widgetData.bg_uniq_id === undefined){
        return false;
      }
      var header_uniq_id = self.data.bg_uniq_id;
      // body...
      var header_contents = self.pageContents.find('[data-bg-uniq-id="' + header_uniq_id +'"]');
      //TODO this isnt tested
      return header_contents.has('[data-bg-uniq-id="' + widgetData.bg_uniq_id +'"]').length > 0;
    };

    PageHeader.prototype.updateWidgetUI = function(updatedWidgetData) {
      var self = this;
      if(self.isWidget(updatedWidgetData)){
        console.log('Update root widget');
        updateData(self.data,updatedWidgetData);
      } else {
        if('heading' === updatedWidgetData.bgmanage_type){
          updateData(self.data.center,updatedWidgetData);
        } else if('link_button' === updatedWidgetData.bgmanage_type ){
          //find left or right
          //TODO null checks ?
          console.log("Updating link button");
          if(self.data.left.bg_uniq_id === updatedWidgetData.bg_uniq_id){
            console.log("Updating link button left");
            console.log(updatedWidgetData);
            updateData(self.data.left,updatedWidgetData);
          } else {
            console.log("Updating link button right");
            updateData(self.data.right,updatedWidgetData);
          }
        }else {
          throw('Ui update function not implemented for ' + updatedWidgetData.bgmanage_type);
        }
      }
        self.destroyWidget();
        self.redrawWidget();
        self.setupControls();
    };

    PageHeader.prototype.deleteWidget = function(updatedWidgetData) {
      var self = this;
      //TODO check if the widget itself is being deleted.
      if(self.isWidget(updatedWidgetData)){
        self.destroyWidget();
        self.data = null;
        self.setupControls();
      } else {
        if('heading' === updatedWidgetData.bgmanage_type){
          self.data.center = null;
        } else if('link_button' === updatedWidgetData.bgmanage_type ){
          //find left or right
          //TODO null checks ?
          if(self.data.left.bg_uniq_id === updatedWidgetData.bg_uniq_id){
            self.data.left = null;
          } else {
            self.data.right = null;
          }
        }else {
          throw('Ui update function not implemented for ' + updatedWidgetData.bgmanage_type);
        }
        self.redrawWidget();
        self.setupControls();
      }
    };
    PageHeader.prototype.deleteWidgetUI = function(updatedWidgetData) {
      var self = this;
      console.log("Updating widget with data");
      console.log(updatedWidgetData);
      if('heading' === updatedWidgetData.bgmanage_type){
        //TODO not implemented
        //TODO neither is insertHeading updated
        self.deleteHeading(updatedWidgetData);
      } else if('link_button' === updatedWidgetData.bgmanage_type ){
        self.deleteLinkButton(updatedWidgetData);
      }else {
        throw('Ui update function not implemented for ' + updatedWidgetData.bgmanage_type);
      }
    };
    PageHeader.prototype.deleteLinkButton = function(updatedWidgetData) {
      var self = this;
      //TODO main content,page content WTF ?
      var link_button = self.pageContents.find('[data-bg-uniq-id="' + updatedWidgetData.bg_uniq_id +'"]');
      var link_button_class_string = $(link_button).attr('class');
      var link_button_type = 'left';
      if(link_button_class_string.indexOf('ui-btn-left') != -1){
        link_button_type = 'left'
      } else if(link_button_class_string.indexOf('ui-btn-right') != -1){
        link_button_type = 'right'
      } else {
        console.log('TODO should not happen');
        return;
      }
      console.log("link_button_type is " + link_button_type);
      //var header = $(link_button).parent();
      //$(link_button).remove();
      //$(header).append(getPlaceHolderHeaderLinkButton(link_button_type));
      self.data[link_button_type] = null;
      self.redrawWidget();
      self.setupControls();

    };
    PageHeader.prototype.isWidget = function(updatedWidgetData) {
      var self = this;
      if(!nullOrUndefined(self.data) && self.data.bg_uniq_id === updatedWidgetData.bg_uniq_id){
        return true;
      } else {
        return false;
      }

    };
    PageHeader.prototype.isOrHasWidget = function(updatedWidgetData) {
      var self = this;
      return self.isWidget(updatedWidgetData) || self.hasWidget(updatedWidgetData);
    };
    //TODO we can make this common
    PageHeader.prototype.getUpdatedHtml = function() {
      var self = this;
      if(nullOrUndefined(self.data)){
        return null
      } else {
        return getHeaderHtml(self.data)
      }

    };
    return PageHeader;
});
