const express = require('express');
const router = express.Router();

const rpc_client = require('../rpc_client/rpc_client_service');
router.get('/userId/:userId/pageNum/:pageNum', getNewsSummary);
router.get('/default', getDefault);
router.get('/search/q/:query/pageNum/:pageNum', getNewsFromSearchKey);
router.post('/userId/:userId/newsId/:newsId', storeClicksLogs);

module.exports = router;

function getDefault(req, res, next) {
  rpc_client.getNewsDefault(response => res.json(response));
}

function getNewsFromSearchKey(req, res, next) {
  query = decodeURIComponent(req.params['query']);
  page_num = req.params['pageNum'];

  console.log(query, page_num);

  rpc_client.getNewsFromSearchKey(query, page_num, response => res.json(response));
}

function getNewsSummary(req, res, next) {
  user_id = req.params['userId'];
  page_num = req.params['pageNum'];

  console.log(user_id, page_num);

  rpc_client.getNewsSummariesForUser(user_id, page_num, response => res.json(response));
}

function storeClicksLogs(req, res, next) {
  user_id = req.params['userId'];
  news_id = req.params['newsId'];

  console.log(user_id, news_id); 
  rpc_client.logNewsClickForUser(req.params);
  res.status(200);
}

/* GET news summary list. */
// router.get('/', function(req, res, next) {
//     news = [
//           {
//             url:
//               "http://us.cnn.com/2017/02/15/politics/andrew-puzder-failed-nomination/index.html",
//             title: "Inside Andrew Puzder's failed nomination",
//             description:
//               "In the end, Andrew Puzder had too much baggage -- both personal and professional -- to be confirmed as President Donald Trump's Cabinet.",
//             source: "cnn",
//             urlToImage:
//               "http://i2.cdn.cnn.com/cnnnext/dam/assets/170215162504-puzder-trump-file-super-tease.jpg",
//             digest: "3RjuEomJo26O1syZbU7OHA==\n",
//             reason: "Recommend",
//             category: "business",
//             publishedAt: "2018-09-01T23:52:36.632Z"
//           },
//           {
//             title:
//               "Zero Motorcycles CTO Abe Askenazi on the future of two-wheeled EVs",
//             description:
//               "Electric cars and buses have already begun to take over the world, but the motorcycle industry has been much slower to put out all-electric and hybrid models...",
//             url:
//               "https://techcrunch.com/2017/03/23/zero-motorcycles-cto-abe-askenazi-on-the-future-of-two-wheeled-evs/",
//             urlToImage:
//               "https://tctechcrunch2011.files.wordpress.com/2017/03/screen-shot-2017-03-23-at-14-04-01.png?w=764&h=400&crop=1",
//             source: "techcrunch",
//             digest: "3RjuEomJo26O1syZbUdOHA==\n",
//             time: "Today",
//             reason: "Hot",
//             publishedAt: "2018-09-05T23:52:36.632Z"
//           },
//           {
//             description:
//               "The president, in a pair of tweets, said the Justice Department was putting the re-election chances of two “popular” Republican lawmakers at risk.",
//             title:
//               "Trump Blasts Sessions for Charging G.O.P. Members Before Midterms",
//             url:
//               "https://www.nytimes.com/2018/09/03/us/politics/trump-sessions-midterms.html",
//             source: "The New York Times",
//             urlToImage:
//               "https://static01.nyt.com/images/2018/09/04/us/04dc-TRUMP/04dc-TRUMP-facebookJumbo.jpg",
//             digest: "TdiBpJoh7vuKj1VbEvBk+Q==\n",
//             reason: "Recommend",
//             publishedAt: "2018-09-03T23:52:36.632Z"
//           },
//           {
//             description:
//               "Two top House Republicans asked the Inspector General on Wednesday to investigate leaks surrounding the ouster of former national security adviser Michael Flynn.",
//             title:
//               "Chaffetz, Goodlatte ask government watchdog to investigate leaks",
//             url:
//               "http://us.cnn.com/2017/02/15/politics/jason-chaffetz-inspector-general/index.html",
//             author: "Eli Watkins, CNN",
//             publishedAt: "2017-02-16T04:13:57.000Z",
//             source: "cnn",
//             urlToImage:
//               "http://i2.cdn.cnn.com/cnnnext/dam/assets/170117204533-chaffetz-cummings-oversight-super-tease.jpg",
//             class: "Politics \u0026 Government",
//             digest: "E0U0uDU1e1zQcF3/l8kBPw==\n"
//           },
//           {
//             description:
//               "Heavy rains slammed Southern California on Friday, killing two people, downing power lines and leaving cars submerged on the streets.",
//             title: "2 dead as storm rips through Southern California",
//             url:
//               "http://us.cnn.com/2017/02/18/us/southern-california-storm/index.html",
//             author: "Steve Almasy and Azadeh Ansari, CNN",
//             publishedAt: "2017-02-18T07:45:12.000Z",
//             source: "cnn",
//             urlToImage:
//               "http://i2.cdn.cnn.com/cnnnext/dam/assets/170217204904-southern-california-flooding-02172017-super-tease.jpg",
//             class: "Media",
//             digest: "aDxS7C+nPLXd0Y2xKhRc2Q==\n"
//           },
//           {
//             description:
//               "President Donald Trump, after a month of arduous and, at times, turbulent governing, got what he came for Saturday during a dusk rally here: Campaign-level adulation.",
//             title:
//               "Trump gets what he wants in Florida: Campaign-level adulation",
//             url:
//               "http://us.cnn.com/2017/02/18/politics/donald-trump-florida-campaign-rally/index.html",
//             author: "Dan Merica, CNN",
//             publishedAt: "2017-02-19T00:23:22.000Z",
//             source: "cnn",
//             urlToImage:
//               "http://i2.cdn.cnn.com/cnnnext/dam/as^sets/170204102117-donald-trump-feb-3-super-tease.jpg",
//             class: "Politics \u0026 Government",
//             digest: "eZRhg2ou+NXu9xiwEhi9eQ==\n"
//           },
//           {
//             description:
//               "President Trump had a supporter in the crowd join him on stage to deliver remarks during his rally in Melbourne, Florida.",
//             title: "Trump brings supporter on stage during rally - CNN Video",
//             url:
//               "http://us.cnn.com/videos/politics/2017/02/18/trump-supporter-speaks-on-stage-melbourne-rally-nr.cnn",
//             author: null,
//             publishedAt:"2017-02-19T00:45:31.000Z",
//             source: "cnn",
//             urlToImage:
//               "http://i2.cdn.cnn.com/cnnnext/dam/assets/170218181254-trump-supporter-super-tease.jpg",
//             class: "Politics \u0026 Government",
//             digest: "IvRkKHBMKTYcHXSfk/oUeQ==\n"
//           }
//         ];
//     res.json(news);
//   });
  
  