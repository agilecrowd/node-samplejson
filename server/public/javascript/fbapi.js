    /* check if the user is loggedin to Facebook or not
       show login dialog if did not
    */
    function loginFacebook(callback) {
        // checkLoginState
        FB.getLoginStatus(function(response) {
            if (response.status !== "connected") {
                // show login dialog
                FB.login(function(response) {
                    if (response.status !== "connected") {
                        soncole.log("retry...");
                    }
                    callback(response.status);
                });
            }
            callback(response.status);
        });
    }

    function feedFacebook(message) {
        console.log("feedFacebook: " + message);
        FB.api('/me/feed', 'post', message);
    }
