# Introduction

[![JS.ORG](https://img.shields.io/badge/js.org-eventstore-ffb400.svg?style=flat-square)](http://js.org)
[![travis](https://img.shields.io/travis/adrai/node-eventstore.svg)](https://travis-ci.org/adrai/node-eventstore) [![npm](https://img.shields.io/npm/v/eventstore.svg)](https://npmjs.org/package/eventstore)

The project goal is to provide an eventstore implementation for node.js:

- load and store events via EventStream object
- event dispatching to your publisher (optional)
- supported Dbs (inmemory, mongodb, redis, tingodb, elasticsearch, azuretable)
- snapshot support
- query your events

# Consumers

- [cqrs-domain](https://github.com/adrai/node-cqrs-domain)
- [cqrs](https://github.com/leogiese/cqrs)

# Installation

    npm install eventstore

# Usage

## Require the module and init the eventstore:

    var eventstore = require('eventstore');

    var es = eventstore();

By default the eventstore will use an inmemory Storage.

### Logging

For logging and debugging you can use [debug](https://github.com/visionmedia/debug) by [TJ Holowaychuk](https://github.com/visionmedia)

simply run your process with

    DEBUG=eventstore* node app.js

## Provide implementation for storage

example with mongodb:

    var es = require('eventstore')({
      type: 'mongodb',
      host: 'localhost',                          // optional
      port: 27017,                                // optional
      dbName: 'eventstore',                       // optional
      eventsCollectionName: 'events',             // optional
      snapshotsCollectionName: 'snapshots',       // optional
      transactionsCollectionName: 'transactions', // optional
      timeout: 10000                              // optional
      // authSource: 'authedicationDatabase',        // optional
      // username: 'technicalDbUser',                // optional
      // password: 'secret'                          // optional
    });

example with redis:

    var es = require('eventstore')({
      type: 'redis',
      host: 'localhost',                          // optional
      port: 6379,                                 // optional
      db: 0,                                      // optional
      prefix: 'eventstore',                       // optional
      eventsCollectionName: 'events',             // optional
      snapshotsCollectionName: 'snapshots',       // optional
      timeout: 10000                              // optional
      // password: 'secret'                          // optional
    });

example with tingodb:

    var es = require('eventstore')({
      type: 'tingodb',
      dbPath: '/path/to/my/db/file',              // optional
      eventsCollectionName: 'events',             // optional
      snapshotsCollectionName: 'snapshots',       // optional
      transactionsCollectionName: 'transactions', // optional
      timeout: 10000                              // optional
    });

example with elasticsearch:

    var es = require('eventstore')({
      type: 'elasticsearch',
      host: 'localhost:9200',                     // optional
      indexName: 'eventstore',                    // optional
      eventsTypeName: 'events',                   // optional
      snapshotsTypeName: 'snapshots',             // optional
      log: 'warning',                             // optional
      maxSearchResults: 10000                     // optional
    });

example with azuretable:

    var es = require('eventstore')({
      type: 'azuretable',
      storageAccount: 'nodeeventstore',
      storageAccessKey: 'aXJaod96t980AbNwG9Vh6T3ewPQnvMWAn289Wft9RTv+heXQBxLsY3Z4w66CI7NN12+1HUnHM8S3sUbcI5zctg==',
      storageTableHost: 'https://nodeeventstore.table.core.windows.net/',
      eventsTableName: 'events',             // optional
      snapshotsTableName: 'snapshots',       // optional
      timeout: 10000                              // optional
    });


## Built-in event publisher (optional)

if defined the eventstore will try to publish AND set event do dispatched on its own...

### sync interface

    es.useEventPublisher(function(evt) {
      // bus.emit('event', evt);
    });

### async interface

    es.useEventPublisher(function(evt, callback) {
      // bus.sendAndWaitForAck('event', evt, callback);
    });


## catch connect and disconnect events

    es.on('connect', function() {
      console.log('storage connected');
    });

    es.on('disconnect', function() {
      console.log('connection to storage is gone');
    });


## define event mappings [optional]
Define which values should be mapped/copied to the payload event.

    es.defineEventMappings({
      id: 'id',
      commitId: 'commitId',
      commitSequence: 'commitSequence',
      commitStamp: 'commitStamp',
      streamRevision: 'streamRevision'
    });

## initialize

    es.init(function (err) {
      // this callback is called when all is ready...
    });

    // or

    ex.init(); // callback is optional


## working with the eventstore

### get the eventhistory (of an aggregate)

    es.getEventStream('streamId', function(err, stream) {
      var history = stream.events; // the original event will be in events[i].payload

      // myAggregate.loadFromHistory(history);
    });

or

    es.getEventStream({
      aggregateId: 'myAggregateId',
      aggregate: 'person',          // optional
      context: 'hr'                 // optional
    }, function(err, stream) {
      var history = stream.events; // the original event will be in events[i].payload

      // myAggregate.loadFromHistory(history);
    });

'streamId' and 'aggregateId' are the same...
In ddd terms aggregate and context are just to be more precise in language.
For example you can have a 'person' aggregate in the context 'human ressources' and a 'person' aggregate in the context of 'business contracts'...
So you can have 2 complete different aggregate instances of 2 complete different aggregates (but perhaps with same name) in 2 complete different contexts

you can request an eventstream even by limit the query with a 'minimum revision number' and a 'maximum revision number'

    var revMin = 5,
        revMax = 8; // if you omit revMax or you define it as -1 it will retrieve until the end

    es.getEventStream('streamId' || {/* query */}, revMin, revMax, function(err, stream) {
      var history = stream.events; // the original event will be in events[i].payload

      // myAggregate.loadFromHistory(history);
    });

store a new event and commit it to store

    es.getEventStream('streamId', function(err, stream) {
      stream.addEvent({ my: 'event' });
      stream.addEvents([{ my: 'event2' }]);

      stream.commit();

      // or

      stream.commit(function(err, stream) {
        console.log(stream.eventsToDispatch); // this is an array containing all added events in this commit.
      });
    });

if you defined an event publisher function the committed event will be dispatched to the provided publisher

if you just want to load the last event as stream you can call getLastEventAsStream instead of ´getEventStream´.


## working with snapshotting

get snapshot and eventhistory from the snapshot point

    es.getFromSnapshot('streamId', function(err, snapshot, stream) {
      var snap = snapshot.data;
      var history = stream.events; // events history from given snapshot

      // myAggregate.loadSnapshot(snap);
      // myAggregate.loadFromHistory(history);
    });

or

    es.getFromSnapshot({
      aggregateId: 'myAggregateId',
      aggregate: 'person',          // optional
      context: 'hr'                 // optional
    }, function(err, snapshot, stream) {
      var snap = snapshot.data;
      var history = stream.events; // events history from given snapshot

      // myAggregate.loadSnapshot(snap);
      // myAggregate.loadFromHistory(history);
    });

you can request a snapshot and an eventstream even by limit the query with a 'maximum revision number'

    var revMax = 8; // if you omit revMax or you define it as -1 it will retrieve until the end

    es.getFromSnapshot('streamId' || {/* query */}, revMax, function(err, stream) {
      var snap = snapshot.data;
      var history = stream.events; // events history from given snapshot

      // myAggregate.loadSnapshot(snap);
      // myAggregate.loadFromHistory(history);
    });


create a snapshot point

    es.getFromSnapshot('streamId', function(err, snapshot, stream) {

      var snap = snapshot.data;
      var history = stream.events; // events history from given snapshot

      // myAggregate.loadSnapshot(snap);
      // myAggregate.loadFromHistory(history);

      // create a new snapshot depending on your rules
      if (history.length > myLimit) {
        es.createSnapshot({
          streamId: 'streamId',
          data: myAggregate.getSnap(),
          revision: stream.lastRevision,
          version: 1 // optional
        }, function(err) {
          // snapshot saved
        });

        // or

        es.createSnapshot({
          aggregateId: 'myAggregateId',
          aggregate: 'person',          // optional
          context: 'hr'                 // optional
          data: myAggregate.getSnap(),
          revision: stream.lastRevision,
          version: 1 // optional
        }, function(err) {
          // snapshot saved
        });
      }

      // go on: store new event and commit it
      // stream.addEvents...

    });


## own event dispatching (no event publisher function defined)

    es.getUndispatchedEvents(function(err, evts) {
    // or es.getUndispatchedEvents('streamId', function(err, evts) {
    // or es.getUndispatchedEvents({ // free choice (all, only context, only aggregate, only aggregateId...)
    //                                context: 'hr',
    //                                aggregate: 'person',
    //                                aggregateId: 'uuid'
    //                              }, function(err, evts) {

      // all undispatched events
      console.log(evts);

      // dispatch it and set the event as dispatched

      for (var e in evts) {
        var evt = evts[r];
        es.setEventToDispatched(evt, function(err) {});
        // or
        es.setEventToDispatched(evt.id, function(err) {});
      }

    });


## query your events
for replaying your events or for rebuilding a viewmodel or just for fun...

skip, limit always optional

    var skip = 0,
        limit = 100; // if you omit limit or you define it as -1 it will retrieve until the end

    es.getEvents(skip, limit, function(err, evts) {
      // if (events.length === amount) {
      //   events.next(function (err, nextEvts) {}); // just call next to retrieve the next page...
      // } else {
      //   // finished...
      // }
    });

    // or

    es.getEvents('streamId', skip, limit, function(err, evts) {
      // if (events.length === amount) {
      //   events.next(function (err, nextEvts) {}); // just call next to retrieve the next page...
      // } else {
      //   // finished...
      // }
    });

    // or

    es.getEvents({ // free choice (all, only context, only aggregate, only aggregateId...)
      context: 'hr',
      aggregate: 'person',
      aggregateId: 'uuid'
    }, skip, limit, function(err, evts) {
      // if (events.length === amount) {
      //   events.next(function (err, nextEvts) {}); // just call next to retrieve the next page...
      // } else {
      //   // finished...
      // }
    });

by revision

revMin, revMax always optional

    var revMin = 5,
        revMax = 8; // if you omit revMax or you define it as -1 it will retrieve until the end

    es.getEventsByRevision('streamId', revMin, revMax, function(err, evts) {});

    // or

    es.getEventsByRevision({
      aggregateId: 'myAggregateId',
      aggregate: 'person',          // optional
      context: 'hr'                 // optional
    }, revMin, revMax, function(err, evts) {});

by commitStamp

skip, limit always optional

    var skip = 0,
        limit = 100; // if you omit limit or you define it as -1 it will retrieve until the end

    es.getEventsSince(new Date(2015, 5, 23), skip, limit, function(err, evts) {
      // if (events.length === amount) {
      //   events.next(function (err, nextEvts) {}); // just call next to retrieve the next page...
      // } else {
      //   // finished...
      // }
    });

    // or

    es.getEventsSince(new Date(2015, 5, 23), limit, function(err, evts) {
      // if (events.length === amount) {
      //   events.next(function (err, nextEvts) {}); // just call next to retrieve the next page...
      // } else {
      //   // finished...
      // }
    });

    // or

    es.getEventsSince(new Date(2015, 5, 23), function(err, evts) {
      // if (events.length === amount) {
      //   events.next(function (err, nextEvts) {}); // just call next to retrieve the next page...
      // } else {
      //   // finished...
      // }
    });


## get the last event
for example to obtain the last revision nr

    es.getLastEvent('streamId', function(err, evt) {
    });

    // or

    es.getLastEvent({ // free choice (all, only context, only aggregate, only aggregateId...)
      context: 'hr',
      aggregate: 'person',
      aggregateId: 'uuid'
    } function(err, evt) {
    });


## obtain a new id

    es.getNewId(function(err, newId) {
      if(err) {
        console.log('ohhh :-(');
        return;
      }

      console.log('the new id is: ' + newId);
    });


## special scaling handling with mongodb
Inserting multiple events (documents) in mongodb, is not atomic.
For the eventstore tries to repair itself when calling `getEventsByRevision`.
But if you want you can trigger this from outside:

    es.store.getPendingTransactions(function(err, txs) {
      if(err) {
        console.log('ohhh :-(');
        return;
      }

      // txs is an array of objects like:
      // {
      //   _id: '/* the commitId of the committed event stream */',
      //   events: [ /* all events of the committed event stream */ ],
      //   aggregateId: 'aggregateId',
      //   aggregate: 'aggregate', // optional
      //   context: 'context'      // optional
      // }

      es.store.getLastEvent({
        aggregateId: txs[0].aggregateId,
        aggregate: txs[0].aggregate, // optional
        context: txs[0].context      // optional
      }, function (err, lastEvent) {
        if(err) {
          console.log('ohhh :-(');
          return;
        }

        es.store.repairFailedTransaction(lastEvent, function (err) {
          if(err) {
            console.log('ohhh :-(');
            return;
          }

          console.log('everything is fine');
        });
      });
    });



# Sample Integration

- [nodeCQRS](https://github.com/jamuhl/nodeCQRS) A CQRS sample integrating eventstore

# Inspiration

- Jonathan Oliver's [EventStore](https://github.com/joliver/EventStore) for .net.

#[Release notes](https://github.com/adrai/node-eventstore/blob/master/releasenotes.md)

# Database Support
Currently these databases are supported:

1. inmemory
2. mongodb ([node-mongodb-native](https://github.com/mongodb/node-mongodb-native))
3. redis ([redis](https://github.com/mranney/node_redis))
4. tingodb ([tingodb](https://github.com/sergeyksv/tingodb))
5. azuretable ([azure-storage](https://github.com/Azure/azure-storage-node))

## own db implementation
You can use your own db implementation by extending this...

    var Store = require('eventstore').Store,
        util = require('util'),
        _ = require('lodash');

    function MyDB(options) {
      options = options || {};
      Store.call(this, options);
    }

    util.inherits(MyDB, Store);

    _.extend(MyDB.prototype, {

      // ...

    });

    module.exports = MyDB;

and you can use it in this way

    var es = require('eventstore')({
      type: MyDB
    });
    // es.init...


# License

Copyright (c) 2015 Adriano Raiano, Jan Muehlemann

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
