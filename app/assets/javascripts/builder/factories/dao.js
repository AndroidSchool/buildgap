builderApp.factory('DataAccessObject',function($http){
    var DataAccessObject = function(document_id,theme_id){
      this.document_id = document_id;
      this.theme_id = theme_id;
      this.data = null; 
    }
    DataAccessObject.prototype.getData = function(){
      var self = this;
      var apiUrl = '/api/document/'
      apiUrl += self.document_id;
      if(self.theme_id !== null && self.theme_id !== undefined){
        apiUrl += '/' + self.theme_id;
      }
      return $http.get(apiUrl).then(function(response){
        self.data  = response.data;
        return response;
      }); 
    }
    return DataAccessObject;
});
