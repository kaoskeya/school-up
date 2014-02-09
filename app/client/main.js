Router.map(function () {
  this.route('home', {
    path: '/',
    template: 'layout',
    before: function(){
        Router.go('sign-in')
    },
    after : function(){
        // $(document).foundation()

    },
    waitOn : function(){

    }
  });

  this.route('dashboard', {
    path: '/dashboard',
    template: 'layout',
    before: function(){
        if(!Meteor.userId()){
            Router.go('sign-in');
        }

        else{

            if(Roles.userIsInRole(Meteor.userId(), ['school-admin']))
                this.render('school_dashboard', {to : 'content'});

            else
                this.render('parents_dashboard', {to : 'content'}); 

            this.render('navbar', {to : 'header'});
            this.render('footer', {to : 'footer'});
        }
    },
    after : function(){

    },
    waitOn : function(){
        return Meteor.loggingIn()
    }
  });


  this.route('sign-in', {
    path: '/sign-in',
    template: 'layout',
    before: function(){
        console.log("here")
        if(Meteor.userId()){
            Router.go('dashboard');
        }
        console.log("here")

        this.render('login', {to : 'content'});
        this.render('navbar', {to : 'header'});
        this.render('footer', {to : 'footer'});
    },
    after : function(){
        // $(document).foundation()

    },
    waitOn : function(){

    }
  });

    this.route('school-sign-in', {
        path: '/school-sign-in',
        template: 'layout',
        before: function(){
            if(Meteor.userId()){
                Router.go('school-home');
            }

            // render the login template but keep the url in the browser the same
            this.render('layout');
            this.render('school_login', {to : 'content'});
            this.render('navbar', {to : 'header'});
            this.render('footer', {to : 'footer'});
        },
        after : function(){
            // $(document).foundation()

        },
        waitOn : function(){

        }
      });


  this.route('sign-out', {
    path: '/sign-out',
    action: function(){
        Meteor.logout(function(err){
            Router.go('home');
        });
    }
  });

  this.route('enroll_user', {
    path: '/user/enroll/:token',
    before: function(){
        this.data.token = this.params.token;
    },
    action: function(){

        // render the login template but keep the url in the browser the same
        this.render('layout');
        this.render('enroll_user', {to : 'content'});
        this.render('navbar', {to : 'header'});
        this.render('footer', {to : 'footer'});

    }
  });


  this.route('reset_password', {
    path: '/user/reset-password/:token',
    before: function(){
        this.data.token = this.params.token;
    },
    action: function(){

        // render the login template but keep the url in the browser the same
        this.render('layout');
        this.render('reset_password', {to : 'content'});
        this.render('navbar', {to : 'header'});
        this.render('footer', {to : 'footer'});

    }
  });

});