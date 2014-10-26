builderApp.factory('DevicePage',function($http,PageHeader,PageContent,PageTabbedFooter){
    var DevicePage = function(device_data,uiService){
        //TODO null checks
        var self = this;
        this.data = device_data;
        this.uiService = uiService;
        this.mainJquery = null;
        this.mainContents = null;
        this.pageHeader = new PageHeader(self);
        this.pageContent = new PageContent(self);
        this.pageFooter = new PageTabbedFooter(self);
        this.droppingOn = null;
        this.undoStack = [];
        this.redoStack = [];
    }
    //TODO this function is not done ?
    DevicePage.prototype.loadMainIframe  = function(callback){
      //TODO what if loadIframe fails ?
      var iframe_html = renderTemplate('device_page_iframe_template', {bg_uniq_id: this.data.bg_uniq_id});
      $('#device_iframe_holder').append(iframe_html);

      //check if the iframe has loaded
      /*if (checkIframeLoaded('device_page_iframe_' + this.data.bg_uniq_id) != true) {
        console.log("DevicePage IframeLoaded , rendering");
        callback(null);
      } else {*/
        //TODO test if it comes here
        console.log("Waiting for device page iframe load");
          $('#device_page_iframe_' + this.data.bg_uniq_id).load(function(){
            callback(null);
          });
      //}    
    };
    DevicePage.prototype.setupMainIframeData = function(callback){ //TODO error handling
      this.mainJquery = document.getElementById('device_page_iframe_' + this.data.bg_uniq_id).contentWindow.jQuery; 
      this.mainContents = $( '#device_page_iframe_' + this.data.bg_uniq_id ).contents();
      //TODO null checks for above variables
      callback();
    };
    DevicePage.prototype.unsetControls = function(callback) {
      //alert('Unbinding');
      var self = this;

      console.log("Setting up controls for device page");
      self.mainContents.find('body').unbind('scroll');
      
      
      self.mainContents.find('body').unbind('click');
       
      //TODO use data manage instead of id
      self.mainContents.find('#'+'DEVICE_PAGE').droppable().droppable('destroy');

      if(!nullOrUndefined(self.pageHeader)){
        self.pageHeader.unsetControls();
      }
      if(!nullOrUndefined(self.pageContent)){
        self.pageContent.unsetControls();
      }
      if(!nullOrUndefined(self.pageFooter)){
        self.pageFooter.unsetControls();
      }

      callback();
      
    };
    DevicePage.prototype.loadMainContents = function(callback){
      var self = this;

      //TODO use a template for this ?
      this.mainContents.find('body').html('<div data-bgmanage-type="page" data-role="page" data-bg-uniq-id="' +  self.data.bg_uniq_id+ '" id="' + 'DEVICE_PAGE'+ '"></div>');
        async.series(
          [
            function(cb){
              self.pageHeader.load(self.data.bg_uniq_id,self.mainJquery,self.mainContents,self.data['header'],cb ); 
              //cb(null);
            },
            function(cb){
              self.pageContent.load(self.data.bg_uniq_id,self.mainJquery,self.mainContents,self.data['content'],cb ); 
              //cb(null);
            },
            function(cb){
              self.pageFooter.load(self.data.bg_uniq_id,self.mainJquery,self.mainContents,self.data['footer'],false,cb ); 
              //cb(null);
            }

          ],
      function(){
        self.mainJquery('#' + 'DEVICE_PAGE').page({theme:self.data.data_theme_swatch});
        self.mainJquery.mobile.changePage('#' + 'DEVICE_PAGE');
        callback();
        
        });  
    }
    DevicePage.prototype.setupControls = function(callback){
      var self = this;
      self.droppingOnControl = false;
      console.log("Setting up controls for device page");
      self.mainContents.find('body').scroll(function(){
          console.log('Scrolling');
      });
      
      /*
      //TODO dropping on body needs to
      self.mainContents.find('body').droppable({
        drop:function(event,ui){
          console.log("Checking on body");
          setTimeout(function(){
            if(ALREADY_DROPPED == false){
              //self.appendMember();
              alert('Dropped on the body');//should probably add to content members
            } else {
              ALREADY_DROPPED = false;
            }
          },10);
        },
        greedy:true,
        hoverClass:'highlight'
      });*/
      self.mainContents.find('body').click(function(event){
        //TODO check for null uiService
        self.uiService.activateWidget(self.data.bg_uniq_id);
      });
      //TODO use data manage instead of id
      self.mainContents.find('#'+'DEVICE_PAGE').droppable({
        drop:function(event,ui){
          //remove highlight clas
          $(this).removeClass("hover_highlight");

          var component = ui.draggable.attr('data-category');
          var target  = $(DRAG_DATA).attr('data-bgmanage-type');
         
          if(target === undefined){
            console.log($(DRAG_DATA).html());
            if(DRAG_DATA == null){
              target = "page";
            } else {
              alert('Target is undefined');
              console.log(DRAG_DATA);
            }
          }
          console.log("Dragging " +  component + "  on to " + target);

          
          if($(DRAG_DATA).hasClass('dummy')){
            console.log("insertNewLinkButton");
            //if else better way ?
            if($(DRAG_DATA).attr('data-dummy-type') == 'header_link_button' && component == 'button'){
              self.pageHeader.insertNewLinkButton($(DRAG_DATA).attr('data-align'));
            } else if($(DRAG_DATA).attr('data-dummy-type') == 'heading' && component == 'heading') {
              self.pageHeader.insertNewHeading();
            }
            else {
              console.log("Not implemented for this type of combination");
            }
          } else {
            //insert header footer, special cases
            if(component == 'header'){
              self.insertHeader();
            } else if(component == 'tabbed_footer'){
              self.insertTabbedFooter();
            } 
            // you cant drop stuff on things like link_button, filter them here
            else if($(DRAG_DATA).attr('data-bgmanage-type') == 'link_button'){
              console.log("Cant Drop on a link_button");
            }
            // finaly if the component was dropped on the page 
            else if(target == 'page'){
              self.pageContent.insertMember(component);
            } else {
              console.log('Not implemented drop' +  target);
            }
            
          }
          
          
        },
        greedy:true,
        hoverClass:'highlight',
        over: function(event,ui){
          $(this).addClass("hover_highlight");
        
          DRAG_DATA = getDragData(this);

        },
        out: function(event,ui){
          $(this).removeClass("hover_highlight");
          DRAG_DATA = null;
        }
      });
      if(!nullOrUndefined(self.pageHeader)){
        self.pageHeader.setupControls();
      }
      if(!nullOrUndefined(self.pageContent)){
        self.pageContent.setupControls();
      }
      if(!nullOrUndefined(self.pageFooter)){
        self.pageFooter.setupControls();
      }

      callback();
    }
    DevicePage.prototype.renderMainUI = function(callback){
        var self = this;
        async.series(
          [
            function(cb){
              self.loadMainIframe(function(){
                  cb();
              });
            },
            function(cb){
              self.setupMainIframeData(function(){
                  cb();
              });
            },
            function(cb){
              self.loadMainContents(function(){
                  cb();
              });
            },
            function(cb){
              //self.setupControls(cb);
              cb();
            }


          ],
          function(err){
            callback(err); 
          }
        );
    }

    
    DevicePage.prototype.renderUI = function(callback){
        var self = this;
        async.parallel(
          [
            function(cb){
              self.renderMainUI(cb); 
            }


          ],
          function(err){
              if(err !=null || err != undefined){
                console.log("Error rendering UI"); //TODO show error ?
              } else {
                console.log("UI Render complete"); 
                callback(null);
              }
          });
    }

    DevicePage.prototype.show = function(){
      $('#device_page_iframe_' +  this.bg_uniq_id).show();
    }
    DevicePage.prototype.hide = function(){
      $('#device_page_iframe_' +  this.bg_uniq_id).hide();
    }
    DevicePage.prototype.activateWidget = function(widget_id){
      var self = this;
      self.uiService.activateWidget(widget_id);
    }
    DevicePage.prototype.addWidget = function(widget){
      var self = this;
      console.log("Adding Widget");
      self.uiService.addWidget(widget);
    }
    DevicePage.prototype.deleteWidgetUI = function(updatedWidgetData){
      console.log("deleteWidgetUI in DevicePage");
      if(updatedWidgetData == null || updatedWidgetData ==  undefined){
        console.log("updatedWidgetData not found");
        return;
      }
      var self = this;
      
      //TODO avoud if else intelligently 
      console.log("Searching for the widget to delete");
      //first check if it is the header itself
      if(self.pageHeader.isOrHasWidget(updatedWidgetData)){
        self.pageHeader.deleteWidget(updatedWidgetData);
      } else if(self.pageContent.hasWidget(updatedWidgetData)){
        self.pageContent.deleteWidget(updatedWidgetData);
      } else if(self.pageFooter.isWidget(updatedWidgetData)){
        self.pageFooter.deleteWidget(updatedWidgetData);
      } 
      else {
        console.log("Widget not found");
      }
    }

    DevicePage.prototype.updateWidgetUI = function(updatedWidgetData){
      if(updatedWidgetData == null || updatedWidgetData ==  undefined){
        console.log("updatedWidgetData not found");
        return;
      }
      var self = this;
      console.log("Updating widget with data");
      console.log(updatedWidgetData);
      //first check if the updatedWidget is the page itself
      if(self.data.bg_uniq_id === updatedWidgetData.bg_uniq_id){
        var previous_theme_swatch = self.data.data_theme_swatch;
        updateData(self.data,updatedWidgetData);
        self.mainJquery('body').removeClass('ui-overlay-' +previous_theme_swatch);
        self.mainJquery('#' + 'DEVICE_PAGE').removeClass('ui-page-theme-'+previous_theme_swatch);
        self.mainJquery('#' + 'DEVICE_PAGE').page({theme:self.data.data_theme_swatch});
        self.uiService.loadDocumentTree();
        return;
      }
      //first search in the heade
      if (self.pageHeader.isOrHasWidget(updatedWidgetData) == true){
        self.pageHeader.updateWidgetUI(updatedWidgetData);
      } else if(self.pageContent.hasWidget(updatedWidgetData) == true){ //TODO in future move this to isOrHas if we want to edit page_content root as well
          self.pageContent.updateWidgetUI(updatedWidgetData);
      }  else if(self.pageFooter.isWidget(updatedWidgetData)){
        self.pageFooter.updateWidgetUI(updatedWidgetData);
      }
      else {
        console.log("Widget not found");
      }
      
     
    }

    //TODO move this inside PageHeader
    DevicePage.prototype.insertHeader = function() {
      var self = this;
       var pageHeaderJSON = getPageHeaderJSON()
       self.pageHeader.load(self.data.bg_uniq_id,self.mainJquery,self.mainContents,pageHeaderJSON,function(){} ); 
       self.pageHeader.setupControls();
       self.uiService.loadHeaderWidget(pageHeaderJSON);
    };
    DevicePage.prototype.insertTabbedFooter = function() {
      
       var self = this;
       var pageFooterJSON = getPageFooterJSON()
       self.pageFooter.load(self.data.bg_uniq_id,self.mainJquery,self.mainContents,pageFooterJSON,true,function(){} ); 
       self.pageFooter.setupControls();
       self.uiService.loadFooterWidget(pageFooterJSON);
    };

    DevicePage.prototype.getUpdatedDevicePageHtml = function() {
      var self = this;
      var device_page = $('<div data-bgmanage-type="page" data-role="page" data-theme="' + self.data.data_theme_swatch +'" data-bg-uniq-id="' +  self.data.bg_uniq_id+ '" id="' + self.data.id+ '"></div>');
      device_page.append(self.pageHeader.getUpdatedHtml());
      device_page.append(self.pageContent.getUpdatedHtml());
      device_page.append(self.pageFooter.getUpdatedHtml());
      console.log("Data Link to elements");
      $(device_page).find("[data-link-to]").each(function(i){
        $(this).attr('href','#' + self.uiService.getPageIdFromPageBgUniqId($(this).attr('data-link-to')));
      });
      
      var clone = $('<div>').append(device_page).clone();
      clone.find('*').removeAttr('data-bgmanage-type');
      clone.find('*').removeAttr('data-bg-uniq-id');
      /*clone.find('.dummy').remove();*/
      var html_styler = get_html_styler();
      return html_styler(clone.html());
      
    };




    return DevicePage;
});
