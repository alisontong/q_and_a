var app = angular.module('questionApp', ['ngRoute', 'ngResource']).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
        // home page
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'HomeCtrl'
        })
        .when('/:id', {
            templateUrl: 'views/answers.html',
            controller: 'AnswersCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);

app.controller('HomeCtrl', ['$scope', 'Question', function ($scope, Question) {
    $scope.question = {};
    $scope.questions = [];

    $scope.questions = Question.query();

    $scope.createQuestion = function(){
        Question.save($scope.newQuestion);
        $scope.questions.push($scope.newQuestion);
        $scope.newQuestion = {};
    };

    $scope.updateQuestion = function(question) {
        Question.update({id: question._id}, question);
        question.editForm = false;
    };

    $scope.deleteQuestion = function(question) {
        Question.remove({id:question._id});
        var questionIndex = $scope.questions.indexOf(question);
        $scope.questions.splice(questionIndex, 1);
    };
    
}]);

app.controller('AnswersCtrl', ['$scope', 'Question', 'Answer', '$routeParams', function ($scope, Question, Answer, $routeParams) {
    var id = $routeParams.id;

    $scope.question = Question.get({id: id});

    $scope.createAnswer = function(){
        Answer.save({id: $scope.question._id}, $scope.newAnswer);
        $scope.question.answers.push($scope.newAnswer);
        $scope.newAnswer = {};
    };

    $scope.updateAnswer = function(answer) {
        Answer.update({id: $scope.question._id, ida: answer._id}, answer);
        answer.editForm = false;
    };

    $scope.deleteAnswer = function(answer) {
        Answer.remove({id: $scope.question._id, ida: answer._id});
        var answerIndex = $scope.question.answers.indexOf(answer);
        $scope.question.answers.splice(answerIndex, 1);
    }; 
}]);

app.service('Question', ['$resource', function ($resource) {
    return $resource('/api/questions/:id', { id: '@_id' }, {
    update: {
        method: 'PUT'
    }
  });
}]);

app.service('Answer', ['$resource', function ($resource) {
    return $resource('/api/questions/:id/answers/:ida', { id: '@_id' }, {
    update: {
        method: 'PUT'
    }
  });
}]);
