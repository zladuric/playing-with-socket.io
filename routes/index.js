
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Web chat' });
};
exports.channel = function(req, res) {
  res.write('<script src="//connect.facebook.net/en_US/all.js"></script>');
  res.end();
}
