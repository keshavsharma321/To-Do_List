var myApp = angular.module("myApp", ["ui.router"]);

myApp.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state("registration", {
      url: "/registration",
      templateUrl: "reg.html",
      controller: "registerController",
    })

    .state("todo", {
      url: "/todo",
      templateUrl: "todo.html",
      controller: "TodoController",
    })

    .state("login", {
      url: "/log",
      templateUrl: "log.html",
      controller: "loginController",
    });

  $urlRouterProvider.otherwise("/registration");
});

myApp.controller("registerController", [
  "$scope",
  "$http",
  "$state",
  function ($scope, $http, $state) {
    $scope.user = {};
    $scope.confirmPassword = "";

    $scope.register = function () {
      if (
        $scope.user.username &&
        $scope.user.email &&
        $scope.user.password &&
        $scope.confirmPassword === $scope.user.password
      ) {
        var registrationData = {
          username: $scope.user.username,
          email: $scope.user.email,
          password: $scope.user.password,
        };

        localStorage.setItem("data", JSON.stringify(registrationData));

        $http({
          method: "POST",
        //   url: "http://10.21.82.46:8000/api/register/",
          url: "http://10.21.81.145:8000/signup/",

          data: registrationData,
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then(function (response) {
            $scope.user = {};
            $scope.confirmPassword = "";

            console.log("Registration successful");
            $state.go("login");
          })
          .catch(function (error) {
            console.log("Registration failed");
            console.log(error);
          });
      } else {
        console.log("Invalid registration data");
      }
    };
  },
]);

myApp.controller("TodoController", function ($scope, $http) {
  var couter = 1;

  $scope.tasks = JSON.parse(localStorage.getItem(`userdata`)) || {};

  $scope.addTask = function () {
    if ($scope.newTask !== "") {
      const taskId = couter++;
      var user = {
        description: $scope.newTask,
        completed: false,
        id:JSON.parse(localStorage.getItem('id')),
      };
      $scope.tasks[taskId] = {
        description: $scope.newTask,
        completed: false,
      };
      $scope.newTask = "";
      updateLocalStorage();

      $http({
        method: "POST",
        url: "http://10.21.82.46:8000/api/createtodo/",
        //   url: "http://10.21.80.110:8000/todolist/",

        data: user,
      })
        .then(function (response) {
            console.log(success);
          

        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      alert("Taskbar can't be empty");
    }
  };

  $scope.completeTask = function (task) {
    task.completed = true;
    task.completed_time = new Date();
    updateLocalStorage();
  };

  $scope.deleteTask = function (taskId) {
    delete $scope.tasks[taskId];
  };

  $scope.editTask = function (task) {
    task.editing = true;
    $scope.newTask = task.description;
  };

  $scope.updateTask = function (taskId, task) {
    if ($scope.newTask !== "") {
      // var obj = { task.description  $scope.newTask };
      task.description = $scope.newTask;
      $scope.newTask = "";
      task.editing = false;
      updateLocalStorage();
      $http({
        method: "PUT",
        url: "http://10.21.82.46:8000/api/createtodo/",
        //   url: "http://10.21.80.110:8000/todolist/",

        data: obj,
      })
        .then(function (response) {
          console.log(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      Swal.fire("Task bar cannot be empty");
    }
  };

  function updateLocalStorage() {
    localStorage.setItem(`userdata`, JSON.stringify($scope.tasks));
  }
});

myApp.controller("loginController", [
  "$scope",
  "$http",
  "$state",
  function ($scope, $http, $state) {
    $scope.user = {};
    $scope.login = function () {
      var userData = {
        email: $scope.user.email,
        password: $scope.user.password,
      };
      localStorage.setItem("data", JSON.stringify(userData));

      $http({
        method: "POST",
        url: "http://10.21.82.46:8000/api/login/",
        //   url: "http://10.21.80.110:8000/signin/",
        data: userData,
      })
        .then(function (response) {
          var id = response.data.id;
          localStorage.setItem("id",JSON.stringify(id));

          $http({
            method: "GET",
            //   url: "http://10.21.80.110:8000/todolist/",
            url: "http://10.21.82.46:8000/api/createtodo/",
            params: { id: id },
          })
            .then(function (response) {
              $scope.tasks = response.data;

              console.log($scope.tasks);

              $state.go("todo");
            })
            .catch(function (error) {
              console.log("Error fetching data from the API:", error);
            });
        })
        .catch(function (error) {
          console.log("Error during login:", error);
        });
    };
  },
]);
