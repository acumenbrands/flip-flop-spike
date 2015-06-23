# Country Outfitter Flip Flop Spike

See trello card [https://trello.com/c/XBgS4I0n](https://trello.com/c/XBgS4I0n)

## An Important Note on [Semantic Versioning](http://semver.org/)

This library attempts to follow the SemVer specification. Before deploying, be sure to update the library version in <code>package.json</code>. This library will deploy to a semantically versioned path in the specified S3 bucket, so breaking changes will not affect previously deployed versions.


## Environment Setup

1. Install [Node.js](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager)
1. Run <code>npm install</code>, which will install all necessary support libraries for testing building, and exporting
1. Copy <code>config/aws-config.json.example</code> to  <code>config/aws-config.json</code> and fill in with appropriate values.<br>
  _If you don't have actual values for the config params, the example values may be left or changed simply to  <code>""</code>, and the <code>grunt aws</code> task simply won't complete._

## Build for Use In Browsers

1. Follow the [Environment Setup](#environment-setup) steps above
1. Run <code>grunt</code> to build the libraries. If all tests pass, normal and minified libraries will be in the <code>/build</code> directory.

## Run Acceptance Tests Only

1. Follow the [Environment Setup](#environment-setup) steps above
1. Run <code>grunt test</code>

## Deploy to Production

1. Follow the [Environment Setup](#environment-setup) steps above
1. Update the semantic version in <code>package.json</code>
1. Run <code>grunt deploy:production</code>. If all tests pass, normal and minified libraries will be uploaded to the S3 bucket specified in <code>config/aws-config.json</code> along a semantically versioned path, and a matching CloudFront invalidation will be created.

## Implementation Example

To implement this script on a live site, load the script either synchronously or asynchronously using the following:

```JavaScript
<script src="//my-cloudfront-dist-id.cloudfront.net/libs/flip-flop-spike/0.1.0b/flip-flop-spike.min.js"></script>
<script>
  (function() {
    var params = {
      /* ... */
    };
    window.FFS = new FlipFlopSpike(params);
  })();
</script>
```
