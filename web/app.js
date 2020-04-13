var app = angular.module("GuessingGame", []);
app.controller("GameController", ['$scope', '$timeout', '$http', ($scope, $timeout, $http) => {

    $scope.guessesLeft = 8;
    $scope.wins = 0;
    $scope.loses = 0;
    $scope.displayWord = '';
    $scope.input = [{letter:''}];


    $scope.newGame = function() {
        $scope.guessesLeft = 8;
        $scope.displayWord = '';

        let data = {
            sessionID: localStorage.getItem('sessionID')
        };

        $http.post('/word', data).then(function(response) {
            localStorage.setItem('gameID', response.data.gameID);
            localStorage.setItem('sessionID', response.data.sessionID);
            $scope.displayWord = response.data.hiddenword;
        });
    }
    $scope.letterChosen = () => {
        if (($scope.input.letter === '') || ($scope.input.letter.length > 1)) {

            $scope.input.letter = "";
            document.getElementById("invalid").innerHTML = "invalid input!";

        } 
        else {
            document.getElementById("invalid").innerHTML = '';
            let url = '/guessword';

            let data = {
                sessionID: localStorage.getItem('sessionID'),
                gameID: localStorage.getItem('gameID'),
                letter: $scope.input.letter
            };
            let guessData = JSON.stringify(data)

            let config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            $http.post(url, guessData, config).then(function(result) {
                $scope.input.letter = "";
                $scope.displayWord = result.data.hiddenword;
                $scope.guessesLeft = result.data.guessremain;

                let winner = result.data.Won;
                let loser = result.data.Lost;
              
                if (winner) {
                    document.getElementById("winLose").innerHTML = "WON";
                    document.getElementById("newGame").style.display = "block";
                    document.getElementById("showinput").style.display = "none";
                }

                if (loser) {
                    document.getElementById("winLose").innerHTML = "LOST";
                    document.getElementById("newGame").style.display = "block";
                    document.getElementById("showinput").style.display = "none";
                }
                

            }, function(error) {
                console.log(error);
            });


        }
    }

    $scope.newGame();

}])
