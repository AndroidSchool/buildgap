ExternalFilesModalController = function ($scope, $modalInstance,filesData) {

  $scope.form = {
    files : filesData.files,
    file_type: filesData.file_type,
    new_external_file: ""
  }
 
  
  $scope.ok = function () {
    $modalInstance.close($scope.form.files);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
  $scope.addExternalFile =  function(){
    if(!nullOrUndefined($scope.form.new_external_file)){
      if($scope.form.new_external_file.startsWith('http://') || $scope.form.new_external_file.startsWith('https://')){
        $scope.form.files.push($scope.form.new_external_file);
        $scope.form.new_external_file = "";
      } else {
        alert('External Files Need to be located at http/https');
      }
    }
  }
  $scope.$watch('form.files',function(){
    console.log('changed');
  },true);
  $scope.delete = function(search_file){
    var indexOfFile = _.find($scope.form.files,function(file){
      console.log("Comparing " +  file + " - " + search_file);
      return (search_file === file);
    });
    if(!nullOrUndefined(indexOfFile)){
      $scope.form.files.splice(indexOfFile,1);
    }
  }
};
builderApp.controller('ExternalFilesModalController',ExternalFilesModalController);