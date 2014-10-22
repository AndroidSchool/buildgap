builderApp.directive('layoutContainer', function() {
    return {
        link: function (scope, element, attrs) {
            var layout = element.layout({
                  west: {
                    resizable : true,
                    initClosed : false,
                    livePaneResizing: true,
                    size: 270
                  },
                  east: {
                    resizable : false,
                    initClosed : false,
                    livePaneResizing: true,
                    size: 300
                  }
              });
          scope.layout = layout; 

        }
    }
});
builderApp.directive('toggleLayoutEast',function(){
 return function (scope, element, attrs) {
    element.bind("click", function () {
      scope.layout.hide('east');
     
    })
  } 
});
builderApp.filter('fieldCapitalize',function(){
    return function(text){

      if(text == null || text == undefined){
        return ''
      } else {
        return _.reduce(text.split('_'),function(returnStr,string){return returnStr + string.charAt(0).toUpperCase() + string.slice(1) + ' '},''); 
      }
    }
});
