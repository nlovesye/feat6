/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */

import {
  createRequest,
  startWork,
  startFlowing,
} from 'react-server/src/ReactFlightServer';

function renderToReadableStream(model, webpackMap, options) {
  const request = createRequest(
    model,
    webpackMap,
    options ? options.onError : undefined,
    options ? options.context : undefined,
    options ? options.identifierPrefix : undefined,
  );
  const stream = new ReadableStream(
    {
      type: 'bytes',
      start(controller) {
        startWork(request);
      },
      pull(controller) {
        startFlowing(request, controller);
      },
      cancel(reason) {},
    },
    // $FlowFixMe size() methods are not allowed on byte streams.
    {highWaterMark: 0},
  );
  return stream;
}

export {renderToReadableStream};
