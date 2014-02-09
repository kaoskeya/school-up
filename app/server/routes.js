Router.map(function () {
  this.route('stripeEvents', {
    path : '/stripe/events/',
    where: 'server',
    action: function () {
    	console.log(this.request)
	    this.response.writeHead(200, {'Content-Type': 'text/html'})
    }
  });
});