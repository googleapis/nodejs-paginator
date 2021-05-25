// Copyright 2021 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// [START paginator_streamify]
const {paginator} = require('@google-cloud/paginator');

// Let's assume the ApiCaller class calls some real API.
// The call() methods accepts a query object and a callback;
// the callback is called with three parameters:
// - error or null,
// - a list of responses,
// - next query to retrieve the next batch of responses.
// This is similar to BigQuery API.
class ApiCaller {
  constructor() {
    // We use `streamify` to convert the results to a stream.
    this.call = paginator.streamify('call_');
  }

  call_(query, callback) {
    console.log(`Called call_(${JSON.stringify(query)})`);

    const values = [];
    let nextQuery = null;

    if (query.query < 10) {
      // Generate ten values
      for (let idx = 0; idx < 10; ++idx) {
        values.push(query.query * 10 + idx);
      }

      // Query to get the next page
      nextQuery = {query: query.query + 1};
    }

    setTimeout(callback, 500, null, values, nextQuery);
  }
}

// In this sample, we show how the streamified method works.
// We stop streaming when we receive the specific result,
// you can see that it stops requesting new pages after that.
function streamifySample() {
  const apiCaller = new ApiCaller();
  const stream = apiCaller.call({query: 0});
  stream.on('data', data => {
    console.log(data);
    if (data === 30) {
      stream.end();
    }
  });
  stream.on('end', () => {
    console.log('Streaming finished');
  });
}
// [END paginator_streamify]

streamifySample();
