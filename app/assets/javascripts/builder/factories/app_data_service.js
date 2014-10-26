builderApp.factory('AppDataService',function($http,$rootScope,$timeout,$modal){
    var AppDataService = function(parentController){
      var self = this;
      //TODO null checks
      this.parentController = parentController;

      $rootScope.truthValues = ['true','false'];
      $rootScope.themeSwatches = ['a','b','c','d','e'];
      $rootScope.positions = ['inline','fixed','fullscreen'];
      $rootScope.headingTypes = ['h1','h2','h3','h4','h5','h6'];
      $rootScope.transitions = ['none','fade','flop','flip','turn','flow','slidefade','slide','slideup','slidedown'];
      $rootScope.icons = [
        {name:'Home',value:'home'},
        {name:'Arrow Left',value:'arrow-l'},
        {name:'Arrow Right',value:'arrow-r'},
        {name:'Arrow Up',value:'arrow-u'},
        {name:'Arrow Down',value:'arrow-d'}
      ];

      $rootScope.widgets = {};   
      //TODO fix this. ? unneccessary
      $rootScope.active_widget_id = 'bg_uniq_header_heading';
      $rootScope.documentTree = {};

      // The modes
      $rootScope.modes = ['Scheme', 'XML', 'Javascript'];
      $rootScope.mode = $rootScope.modes[2];


      self.codeMirrorInstances = {};
      // The ui-codemirror option
      $rootScope.cmOption = {
        lineNumbers: true,
        indentWithTabs: true,
        width:'100%',
        autofocus:true,
        onLoad : function(_cm){
          _cm.focus();
          self.codeMirrorInstances[_cm.options['instance_type']] = _cm;
          _cm.on("change",function(){
           if(_cm.options['instance_type'] == 'CODE_JAVASCRIPT'){
            self.parentController.appData.app.javascript.custom_js = _cm.getValue();
           } else if(_cm.options['instance_type'] == 'CODE_CSS'){
            self.parentController.appData.app.css.custom_css = _cm.getValue();
           }

          });
        }
      };
       //TODO what is the right place for this function
       $rootScope.fetchImage = function(widgetData){

        /*
          filepicker.getFile(filepicker.MIMETYPES.IMAGES, {'modal': true},function(url,metadata){
            var url_from_metadata = "http://userfiles.buildgap.com/" + metadata.key;
            widgetData['image_url'] = url_from_metadata;
            console.log($rootScope.widgets[widgetData.bg_uniq_id]);
            $rootScope.widgets[widgetData.bg_uniq_id]['image_url'] = widgetData['image_url'];
            setTimeout(function(){ $rootScope.$apply(); });
            self.updateWidgetUI(widgetData);    
          });
      */
        

      }
      $rootScope.appPages = [
          {name:'Home',value:'home'},
          {name:'Videos',value:'videos'}
        ];
      $rootScope.getAppPages = function(){
        return $rootScope.appPages;
      }
      $rootScope.deleteNavbarButton = function(widget,navbarButton){
        var index = -1;
        if(nullOrUndefined(widget) ==  false || nullOrUndefined(widget.members) == false){
          for(var i=0;i< widget.members.length;i++){
            if(widget.members[i].bg_uniq_id == navbarButton.bg_uniq_id){
              index = i;
            }
          }
        }
        widget.members.splice(index,1);
      }
      $rootScope.addNavbarButton = function(widget){
        if(nullOrUndefined(widget) ==  false || nullOrUndefined(widget.members) == false){
          widget.members.push(getNewNavbarButtonJSON());
        }
      }
      $rootScope.deleteFooterTab = function(widget,footerTab){
        var index = -1;
        if(nullOrUndefined(widget) ==  false || nullOrUndefined(widget.tabs) == false){
          for(var i=0;i< widget.tabs.length;i++){
            if(widget.tabs[i].bg_uniq_id == footerTab.bg_uniq_id){
              index = i;
            }
          }
        }
        widget.tabs.splice(index,1);
      }
        
      //TODO move this and the others above in a seperate block
      $rootScope.insertPage = function(){

        self.parentController.insertPage();
      }

      $rootScope.currentView = 'BUILDER';
      $rootScope.previousView = null;
      $rootScope.switchToView = function(view){

        $rootScope.previousView = $rootScope.currentView;
        $rootScope.currentView = view;

        setTimeout(function(){
          var codeMirrorInstance = self.codeMirrorInstances[view];
          if(nullOrUndefined(codeMirrorInstance) == false){
            if(view == 'CODE_HTML'){
              self.codeMirrorInstances[view].setValue(self.parentController.getUpdatedAppHtml());
            }
            codeMirrorInstance.refresh();
            codeMirrorInstance.focus();
          }
        },100)
        
        self.parentController.switchToView(view);
      }

      $rootScope.pageTitle = function(title){

        if(nullOrUndefined(title) || title.trim().length == 0){
          return "Untitled Page"
        } else {
          return title
        }
      }
      
      $rootScope.openExternalFiles = function(file_type){
        var modalInstance = $modal.open({
          templateUrl: 'myModalContent.html',
          controller: 'ExternalFilesModalController',
          resolve: {
            filesData : function(){
              var files = [];
              if(file_type == 'JAVASCRIPT' || file_type == 'CSS'){
                //TODO null check
                files = self.parentController.appData.app[file_type.toLowerCase()]['files'];

              }
              return {
                file_type : file_type,
                files : files
              }
            }
          }
        });

      }
    }
    AppDataService.prototype.getAppPages = function() {
      var self = this;
      return self.parentController.getAppPages();
    };
    AppDataService.prototype.updateWidgetUI = function(updatedWidgetData){
      var self = this;
      self.parentController.updateWidgetUI(updatedWidgetData);    
    }
    AppDataService.prototype.deleteWidgetUI = function(updatedWidgetData){
      console.log("deleteWidgetUI AppDataService");
      if(updatedWidgetData == null || updatedWidgetData ==  undefined){
        console.log("updatedWidgetData not found");
        return;
      }
      var self = this;
      self.parentController.deleteWidgetUI(updatedWidgetData);    
    }
    AppDataService.prototype.setupChangeListener = function(){
      var self = this;
      console.log("Setting up change data");
      $rootScope.$watch('widgets',function(newVal,oldVal){
        if(_.isEqual(newVal,oldVal)){
          console.log("Nothing Changed");
          return;  
        }
        
        if($rootScope.active_widget_id != null && $rootScope.active_widget_id != undefined){
          console.log("Changed");
          console.log($rootScope.widgets[$rootScope.active_widget_id]);
          self.updateWidgetUI($rootScope.widgets[$rootScope.active_widget_id]);  
        } else {
          //TODO what now ?
          console.log("What now");

        }
      },true);
      $rootScope.$watch('cmJsModel',function(newVal,oldVal){
        if(_.isEqual(newVal,oldVal)){
          console.log("Nothing Changed");
          return;  
        }
        console.log(newVal);
      },true);


    }
    AppDataService.prototype.loadWidget = function(widgetData){
      if(nullOrUndefined(widgetData)){
        //TODO the caller should know that it is calling stuff on null
        return;
      }
      console.log("Loading Widget");
      console.log(whitelistJson(widgetData,whiteListKeys[widgetData.bgmanage_type]));
      $rootScope.widgets[widgetData.bg_uniq_id] = whitelistJson(widgetData,whiteListKeys[widgetData.bgmanage_type]);
    }
    AppDataService.prototype.addWidget = function(widgetData){
      var self = this;
      console.log("Adding widget");
      console.log(widgetData);
      self.loadWidget(widgetData);
    }
    
    AppDataService.prototype.loadHeaderWidget = function(headerData){
      $rootScope.widgets[headerData.bg_uniq_id] = whitelistJson(headerData,whiteListKeys['header']);
      if(headerData.left !== null && headerData.left !== undefined){
        this.loadWidget(headerData.left); 
      }
      this.loadWidget(headerData.center); 
    };
    AppDataService.prototype.loadFooterWidget = function(footerData){
      $rootScope.widgets[footerData.bg_uniq_id] = whitelistJson(footerData,whiteListKeys['footer']);
    };

    //TODO assume nothing about the data
    AppDataService.prototype.loadPageWidget = function(pageData){
      //TODO null checks
      //check for atleast bg_uniq_id and bgmanage_type
      $rootScope.widgets[pageData.bg_uniq_id] = whitelistJson(pageData,whiteListKeys['page']);
     
      //TODO null check for header and check if it is visible etc 
      if(!nullOrUndefined(pageData.header)){
        this.loadHeaderWidget(pageData.header);
      }
      //TODO load widgets for the page contents here 

      if(!nullOrUndefined(pageData.content)){
        this.loadContentWidgets(pageData.content);
      }

      if(!nullOrUndefined(pageData.footer)){
        this.loadFooterWidget(pageData.footer);
      }
       
    }
    AppDataService.prototype.loadContentWidgets = function(content_data) {

      var self = this;
      if(!nullOrUndefined(content_data) && !nullOrUndefined(content_data.members)){
          for(var i=0;i<content_data.members.length;i++){
            self.loadWidget(content_data.members[i]);
          } 
      }
    };
    AppDataService.prototype.loadWidgets = function(){
      console.log('Loading Widgets');
      //TODO validate the presence of data
      for(var i=0;i<this.parentController.appData.app.pages.length;i++){
        console.log("Loading Page " + i);
        this.loadPageWidget(this.parentController.appData.app.pages[i]);
      }
    }
    AppDataService.prototype.switchToPage = function(page_bg_uniq_id) {
      var self = this;
      self.parentController.switchToPage(page_bg_uniq_id);
      $rootScope.switchToView('BUILDER');
    };
    AppDataService.prototype.loadDocumentTree = function() {
      var self = this;
      $rootScope.options = {};
      $rootScope.switchToPage = function(page_bg_uniq_id){
        self.switchToPage(page_bg_uniq_id);
      }
      self.reloadTOC();

    };
    //TODO this is a temporary function
    AppDataService.prototype.reloadTOC = function() {
      var self = this;
      $rootScope.toc = convertWidgetDataToTOC(self.parentController.appData);
      $rootScope.appPages = [];
      for(var i = 0;i<this.parentController.appData.app.pages.length;i++){
        $rootScope.appPages.push({
          name: $rootScope.pageTitle(this.parentController.appData.app.pages[i].bgmanage_title),
          value : this.parentController.appData.app.pages[i].bg_uniq_id
        })
      }
      $timeout(function() {
        $rootScope.$apply();
      });
      
    };

    AppDataService.prototype.loadCodeViewerData = function() {
      var self = this;
      $rootScope.cmJsModel = self.parentController.appData.app.javascript.custom_js;
      $rootScope.cmHtmlModel = "Loading Html ... Please Wait.";
      $rootScope.cmCssModel = self.parentController.appData.app.css.custom_css;
      
    };

    AppDataService.prototype.load = function(callback){
      this.loadCodeViewerData();
      this.loadWidgets();
      this.loadDocumentTree();
      console.log($rootScope.widgets);
      
      $rootScope.$apply();
      this.setupChangeListener();
      this.setupDeleteListener();
      callback();
    }
    AppDataService.prototype.insertPage = function(newPageJSON,callback) {
      this.loadPageWidget(newPageJSON);
      this.reloadTOC();
      callback(null);
    };
    AppDataService.prototype.setupDeleteListener = function() {

      var self = this;
      $rootScope.deleteWidget = function(widgetBgUniqId){
        console.log("deleteWidgetUI in setupChangeListener");
        self.deleteWidgetUI($rootScope.widgets[widgetBgUniqId]);
      }
    };
    AppDataService.prototype.activateWidget = function(widget_id){
      console.log("Activating widget in AppDataService");
      if($rootScope.active_widget_id != widget_id){
        $rootScope.active_widget_id = widget_id;
        setTimeout(function(){ $rootScope.$apply(); });
         
      }
    }
    AppDataService.prototype.getUpdatedData = function() {
     console.log("App Data");
     var self = this;
     var appData = JSON.parse(JSON.stringify(self.parentController.appData));
     //TODO validate appData
     for(var i=0;i<appData.app.pages.length;i++){
      self.updateWidgetData(appData.app.pages[i]);
     }
     console.log(appData);
     return appData;
    };
    AppDataService.prototype.updateWidgetData = function(widgetData) {
      var self = this;
      //TODO validate widgetData
      if(nullOrUndefined(widgetData) || nullOrUndefined(widgetData.bg_uniq_id) || nullOrUndefined(widgetData.bgmanage_type)){
        console.log("Invalid Widget Data");
        return;
      }
      if(nullOrUndefined($rootScope.widgets[widgetData.bg_uniq_id])){
        console.log("Could not find widget in app_data_service rootScope");
        return;
      }
      var keys = self.whiteListKeys[widgetData.bgmanage_type];
      if(nullOrUndefined(keys)){
        console.log("Coudl not find keys from whiteListKeys");
        return;
      }
      for(var i = 0;i<keys.length;i++){
        var key = keys[i];
        if(key === 'bgmanage_type' || key === 'bg_uniq_id'){
          continue;
        }
        widgetData[key] = $rootScope.widgets[widgetData.bg_uniq_id][key];

      }
      if(widgetData.bgmanage_type === 'page') {
        self.updateWidgetData(widgetData.header);
        self.updateWidgetData(widgetData.footer);
        if(!nullOrUndefined(widgetData.content)){
          for(var i = 0;i<widgetData.content.length;i++){
            self.updateWidgetData(widgetData.content[i]);
          }
        }
      } else if(widgetData.bgmanage_type === 'header'){
        self.updateWidgetData(widgetData.left);
        self.updateWidgetData(widgetData.center)
        self.updateWidgetData(widgetData.right);;
      } 


    };
    return AppDataService;
});
