(function(){
  angular.module('jf').service('Authentication', function(AjaxAction, Session, Cookie, $location){
    var this$ = this;
    this.checkUrlCookie = function(cookieName){
      var cookieValue;
      cookieValue = $location.search()[cookieName];
      if (cookieValue) {
        console.log("AUTHENTICATION", "Setting authentication cookie " + cookieName + "=" + cookieValue);
        Cookie.create(cookieName, cookieValue, 1);
        return $location.replace().search(cookieName, null);
      }
    };
    this.discoverLoginState = function(){
      var dfd;
      dfd = $.Deferred();
      AjaxAction("is_logged_in").withRawResponse().done(function(response){
        if (response.is_logged_in) {
          Session.login(response.username);
          return dfd.resolve(response.username);
        } else {
          return dfd.reject();
        }
      });
      return dfd;
    };
    this.authenticate = function(credentials){
      var dfd;
      dfd = $.Deferred();
      AjaxAction().post("login").withData(credentials).done(function(){
        Session.login(credentials.username);
        console.log("Session (Authentication)", Session.getUsername());
        return dfd.resolve("OK");
      }).fail(function(error){
        return dfd.reject(error);
      });
      return dfd;
    };
    this.logout = function(){
      var dfd;
      dfd = $.Deferred();
      AjaxAction().post("logout").done(function(){
        Session.logout();
        Cookie.erase("JSESSIONID");
        return dfd.resolve("OK");
      }).fail(function(error){
        alert(arguments);
        return dfd.reject(error);
      });
      return dfd;
    };
    return this;
  });
}).call(this);
