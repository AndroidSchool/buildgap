//TODO instead of using last hover on check for element with hightlight_top and use it
builderApp.factory('PageContent',function($http){
    var PageContent = function(devicePage){
      this.devicePage = devicePage; //TODO null check devicePage
      this.jQuery = null;
      this.mainContents = null;
      this.data = null;
      this.last_hover_on = null;
      console.log("Setting up page content");
    }
    PageContent.prototype.load = function(page_bg_uniq_id,jquery,mainContents,data,cb){
      this.jQuery  = jquery;
      this.mainContents = mainContents;
      this.data = data;
      this.page_bg_uniq_id = page_bg_uniq_id;
      this.jQuery('[data-bg-uniq-id="' + page_bg_uniq_id +'"]').append(getContentHtml(this.data));
      //this.setupControls();
      cb(); 
    }
    PageContent.prototype.setupControls = function(){
     //alert('Setting Up Controls');
     var self = this;
     "div[data-bgmanage-type='content']"
     self.jQuery( "div[data-bgmanage-type='content']" ).sortable({
      placeholder: "ui-state-highlight",
      stop: function(event,ui){
        self.updateMembersOrder();
      }
     });
     self.mainContents.find( '.control' ).droppable({
      //tolerance: "pointer", 
      iframeFix:true,
      
      hoverClass: "highlight_top",
        over: function(event,ui){
          console.log("Hover");
          self.last_hover_on = getDragData(this);

        },
        out: function(event,ui){
          console.log("Out");
          self.last_hover_on = null;
        },
        tolerance: "pointer"

       });
      
      self.mainContents.find('.control').click(function(event){
        event.stopPropagation();
        self.devicePage.activateWidget($(this).attr('data-bg-uniq-id'));
      });
    }
    PageContent.prototype.unsetControls = function() {
     //alert('Setting Up Controls');
     var self = this;
     "div[data-bgmanage-type='content']"
     self.jQuery( "div[data-bgmanage-type='content']" ).sortable().sortable('destroy');
      self.mainContents.find( '.control' ).droppable().droppable('destroy');
    };
   
    //TODO move self.mainContents.find("div[data-bgmanage-type='content']") to common variable
    PageContent.prototype.appendMember = function(){
            var self = this;
            var rand = Math.random().toString(36).substring(7);
            self.mainContents.find("div[data-bgmanage-type='content']").append('<div id="' + rand +'" style=" text-align:center" data-controltype="image" class="control"> <div class="inner_placeholder" style="text-align:center;padding-top:15px;padding-bottom:15px;border: 3px dotted gray">' +  rand +' </div>');
            self.setupControls(function(){});
      
    }
    PageContent.prototype.insertImage = function() {
            var self = this;
            var imageJSON = getNewImageJSON("center");
            self.devicePage.addWidget(imageJSON);
            var imageHtml = getImageHtml(imageJSON);

            if(nullOrUndefined(self.last_hover_on)){
              alert('Adding to last');
              self.mainContents.find("div[data-bgmanage-type='content']").append(imageHtml);   
            } else {
              //TODO check validity
              var bguniq_id = $(self.last_hover_on).attr('data-bg-uniq-id');
              //alert(bguniq_id);
              self.mainContents.find("div[data-bg-uniq-id='" + bguniq_id+"']").before(imageHtml);
              
            }
            //TODO null check
            self.data.members.push(imageJSON);

            
            self.setupControls(function(){});
    };
    PageContent.prototype.insertMap = function() {
            var self = this;
            var mapJSON = getNewMapJSON("center");
            self.devicePage.addWidget(mapJSON);
            console.log("getting mapHtml");
            var mapHtml = getMapHtml(mapJSON);
            if(nullOrUndefined(self.last_hover_on)){
              alert('Adding to last');
              self.mainContents.find("div[data-bgmanage-type='content']").append(mapHtml);   
            } else {
              //TODO check validity
              var bguniq_id = $(self.last_hover_on).attr('data-bg-uniq-id');
              //alert(bguniq_id);
              self.mainContents.find("div[data-bg-uniq-id='" + bguniq_id+"']").before(mapHtml);
              
            }

            //TODO null check
            self.data.members.push(mapJSON);
            self.setupControls(function(){});
    };
    PageContent.prototype.insertNavbar = function() {
            var self = this;
            var navbarJSON = getNewNavbarJSON();
            self.devicePage.addWidget(navbarJSON);
            var navbarHtml = getNavbarHtml(navbarJSON);
            console.log(self.last_hover_on);
            if(nullOrUndefined(self.last_hover_on)){
              alert('Adding to last');
              self.mainContents.find("div[data-bgmanage-type='content']").append(navbarHtml);   
            } else {
              //TODO check validity
              var bguniq_id = $(self.last_hover_on).attr('data-bg-uniq-id');
              //alert(bguniq_id);
              self.mainContents.find("div[data-bg-uniq-id='" + bguniq_id+"']").before(navbarHtml);
              
            }

            self.jQuery("div[data-role='navbar']").navbar();

            //TODO null check
            self.data.members.push(navbarJSON);
            self.setupControls(function(){});
    };
    PageContent.prototype.insertMember = function(component) {
      console.log(component);
      if(component == 'image'){
        this.insertImage();
      } else if(component == 'map'){
        this.insertMap();
      } else if(component == 'navbar'){
        this.insertNavbar();
      }
    };
    PageContent.prototype.hasWidget = function(widgetData) {
      console.log("Searching for");
      console.log(widgetData);
      var self = this;
      if(widgetData === null || widgetData === undefined){
        return false;
      }
      if(widgetData.bg_uniq_id === null || widgetData.bg_uniq_id === undefined){
        return false;
      }

      var mainContents = self.mainContents.find("div[data-bgmanage-type='content']");
      var has = mainContents.has('[data-bg-uniq-id="' + widgetData.bg_uniq_id +'"]');

      return has.length > 0;

    };
    PageContent.prototype.updateWidgetUI = function(updatedWidgetData) {
      var self = this;
      var existingWidgetElement = self.mainContents.find("div[data-bg-uniq-id='" + updatedWidgetData.bg_uniq_id +"']")
      if(existingWidgetElement.length === 0){
        console.log("TODO no such element");
        return;
      }
      var freshHTML = getHtml(updatedWidgetData);
      if(nullOrUndefined(freshHTML) === false){
        existingWidgetElement.replaceWith(freshHTML);
      } else {
        console.log("TODO could not getHTML for");
        console.log(updatedWidgetData);
      }
      if(updatedWidgetData.bgmanage_type == 'navbar'){
        self.jQuery("div[data-role='navbar']").navbar();
      }
      //TODO code path for self . isWidget
      var widgetData = null; 
      for(var i = 0;i < self.data.members.length;i++){
        if(self.data.members[i].bg_uniq_id == updatedWidgetData.bg_uniq_id){
          //found widget,keep data
          widgetData = self.data.members[i];
        }
      }
      if(!nullOrUndefined(widgetData)){
        console.log("Updating data members");
        updateData(widgetData,updatedWidgetData);
      } else {
        console.log('Could not find updated data in the members');
      }
      self.setupControls(function(){});

    };
    PageContent.prototype.deleteWidget = function(updatedWidgetData) {
      var self = this;
      var existingWidgetElement = self.mainContents.find("div[data-bg-uniq-id='" + updatedWidgetData.bg_uniq_id +"']")
      if(existingWidgetElement.length === 0){
        console.log("TODO no such element");
        return;
      }

      existingWidgetElement.remove();
      
     
      //TODO code path for self . isWidget
      var widgetDataIndex = null; 
      for(var i = 0;i < self.data.members.length;i++){
        if(self.data.members[i].bg_uniq_id == updatedWidgetData.bg_uniq_id){
          //found widget,keep data
          widgetDataIndex = i
        }
      }
      if(!nullOrUndefined(widgetDataIndex)){
        console.log("Deleting Member");
        self.data.members.splice(widgetDataIndex,1);
      } else {
        console.log('Could not find updated data in the members');
      }
      self.setupControls(function(){});

    };
    PageContent.prototype.updateMembersOrder = function() {
      var self = this;
      var content = self.mainContents.find("div[data-bgmanage-type='content']");
      var members = content.find("[data-bg-uniq-id]");
      if(nullOrUndefined(members)){
        return;
      } 
      var orderFromCurrentHtml = {};
      for(var i = 0;i< members.length;i++){
        //TODO null check
        var bg_uniq_id = self.jQuery(members[i]).attr('data-bg-uniq-id') 
        console.log(bg_uniq_id);
        orderFromCurrentHtml[bg_uniq_id] = i;
      }
      //TODO null check
      self.data.members.sort(function(p,q){
        return orderFromCurrentHtml[p.bg_uniq_id] - orderFromCurrentHtml[q.bg_uniq_id];
      });
    };

    PageContent.prototype.getUpdatedHtml = function() {
      var self = this;
      if(nullOrUndefined(self.data)){
        return null
      } else {
        return getContentHtml(self.data)
      }
    };

    return PageContent;
});
