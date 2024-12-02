var app = angular.module( "appBiz", [] );

    app.controller(
        "BizController",
        function( $scope, $http) {

    $scope.getTxnid = function () {
      //Calculate random txnid
      $scope.txnid = 'Txn' + Math.floor(Math.random() * 100);
    }

    $scope.Process = function () {
      //alert('hai');
      $scope.jsdump = "";
      var request = $http({
        method: "post",
        url: "process.php",
        data: {
          txnid: $scope.txnid,
          amount: $scope.amount,
          pinfo: $scope.productinfo,
          fname: $scope.firstname,
          lname: $scope.lastname,
          zip: $scope.zipcode,
          email: $scope.email,
          phone: $scope.phone,
          address1: $scope.address1,
          address2: $scope.address2,
          city: $scope.city,
          state: $scope.state,
          country: $scope.country,
          pg: $scope.pg
        }
      }).then(function successCallBack(html) {
        $scope.jsdump = html.data;
      });
    }
        }
    );

    app.value(
        "$sanitize",
        function( html ) {
            return( html );
        }
    );
