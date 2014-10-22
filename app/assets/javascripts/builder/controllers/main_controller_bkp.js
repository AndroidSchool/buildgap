builderApp.controller('MainController',function($scope,$http,DataAccessObject,DevicePage,Toolbar){

  // scope variables
  $scope.appData  = null;
  $scope.activeComponent = 'header_uniq_id';
  $scope.devicePages = {}; 
  //scope functions
  $scope.toolbar = new Toolbar();
  
  var self = this; 
  
  $scope.init = function(callback){
    var dao = new DataAccessObject('document_id','theme_id');
    dao.getData().then(function(){
      $scope.appData = dao.data;
      callback(null);
    },function(err){
      callback(err);
    });
  }


  //rendersUI
  $scope.renderUI = function(callback){
    //TODO null checks here ?
      console.log($scope.appData);
    for(var i =0;i<$scope.appData['app']['pages'].length;i++){
      var devicePage =  new DevicePage($scope.appData['app']['pages'][i]);
      $scope.devicePages[devicePage.data.uniq_id] = devicePage;
    }
    //call render UI on all devicePages 
    async.each(
          Object.keys($scope.devicePages),function(devicePageUniqId, callback){
            $scope.devicePages[devicePageUniqId].renderUI(callback);  
          },
          function(err){
            if(err != null || err != undefined) {
              console.log(err); //TODO  display error
              callback(err);
            } else {
              console.log("Devices Pages Rendered Successfully"); 
              // get page id here and show TODO
              //$scope.devicePages['uniq_id_1'].show();
              $scope.activePage = 'uniq_id_1';
              $scope.$apply();
              $('#device_page_iframe_uniq_id_1').show();
              //$('#device_page_iframe_uniq_id_1').show();
              callback(null);
            }
          }

       );
  }
  
  //main ui logic
  async.waterfall([
    //get Data first
    function(callback){
        $scope.init(callback); 
    },
    // then render the UI
    function(callback){
      $scope.renderUI(callback);
    },
    //setup the toolbar controls
    function(callback){
      $scope.toolbar.setupControls(callback);
    }
  ],
  function(err,result){
    if(err != null || err != undefined){
    } else {
      console.log("Complete");
    }
  });

});
