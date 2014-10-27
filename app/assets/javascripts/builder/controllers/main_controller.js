MainController = function($scope,$http,DataAccessObject,AppDataService,AppUIService,Toolbar,DeviceTestPage){
  var self = this; 

  // scope variables
  self.appData  = null;
  self.appDataService = new AppDataService(self);
  self.appUIService = new AppUIService(self);
  self.deviceTestPage = new DeviceTestPage(self);
  self.dao = new DataAccessObject('document_id','theme_id');
  self.toolbar = new Toolbar();
  self.scope = $scope;
  
  //TODO move this to a seperate function ? 
  //main ui logic
  async.waterfall([
    //get Data first
    function(callback){
        self.initData(callback); 
    },
    function(callback){
      self.appDataService.load(callback);
    },
    function(callback){
      self.appUIService.load(callback);
    },
    function(callback) {
      self.toolbar.setupControls(callback);
    }
  ],
  function(err,result){
    if(err != null || err != undefined){
      //TODO handle error here
    } else {
      console.log("Complete");
      if(self.appData.app.pages.length > 0){
        self.appUIService.switchToPage(self.appData.app.pages[0].bg_uniq_id);
      }
    }
  });

};
MainController.prototype.initData = function(callback){
    var self = this;
    self.dao.getData().then(function(){
      self.appData = self.dao.data;
      callback(null);
    },function(err){
      callback(err);
    });
}
//TODO this is just a dummySignal 
MainController.prototype.activateWidget = function(widget_id){
  //TODO null check for app data service
  var self = this;
  self.appDataService.activateWidget(widget_id);
}
MainController.prototype.addWidget = function(widget){
  //TODO null check for app data service
  var self = this;
  console.log("addWidget MainController");
  self.appDataService.addWidget(widget);
}
MainController.prototype.updateWidgetUI = function(updatedWidgetData){
  var self = this;
  self.appUIService.updateWidgetUI(updatedWidgetData);
}
MainController.prototype.deleteWidgetUI = function(updatedWidgetData){
  console.log("deleteWidgetUI in MainController");
  var self = this;
  self.appUIService.deleteWidgetUI(updatedWidgetData);
}
MainController.prototype.loadHeaderWidget = function(headerData) {
  var self = this;
  self.appDataService.loadHeaderWidget(headerData);
};
MainController.prototype.loadFooterWidget = function(footerData) {
  var self = this;
  self.appDataService.loadFooterWidget(footerData);
};
MainController.prototype.switchToPage = function(page_bg_uniq_id) {
  var self = this;
  self.appUIService.switchToPage(page_bg_uniq_id);
};
MainController.prototype.insertPage = function() {
  var self = this;
  var newPageJSON = getNewPageJSON();
  console.log(self.appData);
  self.appData.app.pages.push(newPageJSON);
  async.waterfall([
    function(callback){
      self.appDataService.insertPage(newPageJSON,callback);
      
    },
    function(callback){
      self.appUIService.insertPage(newPageJSON,callback);
    }
  ],
  function(err,result){
    if(err != null || err != undefined){
      //TODO handle error here
    } else {
      console.log("Complete");
    }
  });
};
MainController.prototype.getPageIdFromPageBgUniqId = function(page_bg_uniq_id) {
  var self = this;
  for(var i = 0;i<self.appData.app.pages.length;i++){
    if(self.appData.app.pages[i].bg_uniq_id === page_bg_uniq_id){
      return(self.appData.app.pages[i].id);
    }
  }
  return "";
};
MainController.prototype.switchToView = function(view) {
  var self = this;
  layoutsEnabled = layoutsEnabledForView[view];
  layoutsDisabled = _.difference(['east','west'],layoutsEnabled);
  for(var i = 0;i<layoutsEnabled.length;i++){
    self.scope.layout.show(layoutsEnabled[i]);
  }
  for(var i = 0;i<layoutsDisabled.length;i++){
    self.scope.layout.hide(layoutsDisabled[i]);
  }
  
  self.deviceTestPage.destroy();
  if(view == 'TEST'){
    self.deviceTestPage.reload();
  }
  if(view == 'BUILDER'){
    self.appUIService.switchToActivePage();
  } 
};


MainController.prototype.getUpdatedAppHtml = function() {
  var self = this;
  return self.appUIService.getUpdatedAppHtml();
};
MainController.prototype.getUpdatedData = function() {
  var self = this;
  return self.appDataService.getUpdatedData();
};
MainController.prototype.loadDocumentTree = function() {
 var self = this;
 self.appDataService.loadDocumentTree();
};
MainController.prototype.exportAppAsHtml = function() {
  var self = this;
  self.deviceTestPage.exportAppAsHtml();
};

builderApp.controller('MainController',MainController);
