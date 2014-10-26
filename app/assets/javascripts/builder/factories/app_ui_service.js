builderApp.factory('AppUIService',function($http,$rootScope,DevicePage){
    var AppUIService = function(parentController){

      this.parentController = parentController;

      this.devicePages = {}; 
      this.activePage = null;
      this.rootScope = $rootScope;
      this.setupScopeFunctions();
    }
    AppUIService.prototype.setupScopeFunctions = function() {
      var self = this;
      self.rootScope.undo = function(){
        self.undo();
      }
      self.rootScope.redo = function(){
        self.redo();
      }
     
    };
    AppUIService.prototype.load = function(callback){
      var self = this;
      console.log('Loading Data into App UI Service');

      //TODO validate appData ?
      for(var i =0;i<self.parentController.appData['app']['pages'].length;i++){
        //TODO we are sending data to device page
        var devicePage =  new DevicePage(self.parentController.appData['app']['pages'][i],self);
        //and then using the data from device page to get uniq id , why ?
        self.devicePages[devicePage.data.bg_uniq_id] = devicePage;
      }
      //TODO better way to do this ?
      //what if we need to more stuff, for now just one level deep callback
      self.render(function(){
        callback(null);
      });

    }
    AppUIService.prototype.insertPage = function(newPageJSON,callback) {
        var self = this;
        //TODO we are sending data to device page
        var devicePage =  new DevicePage(newPageJSON,self);
        //and then using the data from device page to get uniq id , why ?
        self.devicePages[devicePage.data.bg_uniq_id] = devicePage;
        self.devicePages[devicePage.data.bg_uniq_id].renderUI(callback);
    };

    AppUIService.prototype.render = function(callback){
      var self = this;
      //TODO null checks on devicesPages
      //call render UI on all devicePages 
      async.each(
            Object.keys(self.devicePages),function(devicePageUniqId, callback){
              self.devicePages[devicePageUniqId].renderUI(callback);  
            },
            function(err){
              if(err != null || err != undefined) {
                console.log(err); //TODO  display error
                callback(err);
              } else {
                console.log("Devices Pages Rendered Successfully"); 
                callback(null);
              }
            }

         );
      
    }

    AppUIService.prototype.activateWidget = function(widget_id){
      var self = this;
      self.parentController.activateWidget(widget_id);

    }
    AppUIService.prototype.updateWidgetUI = function(updatedWidgetData){
      var self = this;
      //TODO this might not be the case always, not neccessariy the active page will have the widget being edited 
      //but for now this would work
      self.devicePages[self.activePage].updateWidgetUI(updatedWidgetData);

    }
    AppUIService.prototype.deleteWidgetUI = function(updatedWidgetData){
      console.log("deleteWidgetUI in AppUIService");
      var self = this;
      self.devicePages[self.activePage].deleteWidgetUI(updatedWidgetData);

    }
    AppUIService.prototype.addWidget = function(widget){
      var self = this;
      console.log("addWidget AppUIService");
      self.parentController.addWidget(widget);

    }
    AppUIService.prototype.loadHeaderWidget = function(headerData) {
      var self = this;
      self.parentController.loadHeaderWidget(headerData);
    };
    AppUIService.prototype.loadFooterWidget = function(footerData) {
      var self = this;
      self.parentController.loadFooterWidget(footerData);
    };
    AppUIService.prototype.switchToPage = function(page_bg_uniq_id) {
      var self = this;
      $('.device_iframe').hide();
      self.activePage = page_bg_uniq_id;
      ACTIVE_PAGE_BG_UNIQ_ID = self.activePage;
      $('#device_page_iframe_' + page_bg_uniq_id).show();
      self.activateWidget(page_bg_uniq_id);
      async.each(
            Object.keys(self.devicePages),function(devicePageUniqId, callback){
              self.devicePages[devicePageUniqId].unsetControls(callback);  
            },
            function(err){
              if(err != null || err != undefined) {
                console.log(err); //TODO  display error
                
              } else {
                //alert("DEvices ubnound"); 
                self.devicePages[self.activePage].setupControls(function(){});
                
              }
            }

         );
    };
    AppUIService.prototype.hideAllDevicePages = function() {
      $('.device_iframe').hide();
    };
    //TODO not tested
    AppUIService.prototype.switchToActivePage = function() {
      var self = this;
      if(!nullOrUndefined(self.activePage)){
        self.switchToPage(self.activePage);
      } else {
        self.switchToPage(self.parentController.appData.app.pages[0].bg_uniq_id)
      }
    };
    AppUIService.prototype.undo = function() {
      alert("Undo");
    };
    AppUIService.prototype.redo = function() {
      alert("Redo");
    };
    AppUIService.prototype.getUpdatedAppHtml = function() {
//
      var self = this;
      var html = "";
      for(var devicePageUniqId in self.devicePages){
        console.log("Html for Page " + devicePageUniqId);
        html += "<!-- New Page Starts -->\n";
        html += self.devicePages[devicePageUniqId].getUpdatedDevicePageHtml();
        html += "\n";

      }
      return html;

//
    };

    AppUIService.prototype.loadDocumentTree = function() {
      var self = this;
      self.parentController.loadDocumentTree();
    };
    AppUIService.prototype.getPageIdFromPageBgUniqId = function(page_bg_uniq_id) {
      return this.parentController.getPageIdFromPageBgUniqId(page_bg_uniq_id);
    };


    return AppUIService;
});
