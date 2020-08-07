<script>
  // MODULES
  import { onMount, onDestroy } from 'svelte'

  // LIBRARY
  import { getRequest } from '../api'
  import { count } from '../stores'

  // IMPORTS
  // The Props
  export let
    // This is the prop that can be imported from the webcomponent
    location = 'gorgous',
    // If we should log to console
    log = true

  // VARIABLES
  // We'll update this variable anytime there is an error
  let error = false

  // This will tell the page we are loading something
  let loading = true

  // Set the pollTime to 30 seconds
  let pollTime = 30000

  // This will hold our poll timeout
  let polling = false

  // LOGIC
  //
  function logger(...val) {
    if (log) {
      console.log(...val)
    }
  }

  // This will update the store, so anything that needs this value can use it
  function updateCount(val = 0) {
    // Set the val of the count on the store
    count.set(val)
    // We'll return the val, because we should return something and it might be useful in the future.
    return val
  }

  async function getCount () {
    // Change the loading state to true
    loading = true

    // Clear the original error if any
    error = false

    // Change
    let res, count

    try {
      res = await getRequest(location)
      count = await res.json()
    }
    catch (err) {
      logger('Error getting count', err)
      error = err
    }

    updateCount(5 /* count */)

    // Change the loading state to false
    loading = false
  }

  // This function is what we call for long polling the api
  function longPoll () {
    logger('Long Poll Called', new Date(Date.now()))
    getCount()
  }

  // Starts polling the API
  function startLongPoll() {
    if (!polling) {
      logger('Starting Long Poll')
      polling = setInterval(function () {
        longPoll()
      }, pollTime)
    }
  }

  // Stops polling the API
  function toggleLongPoll () {
    if (polling) {
      logger('Will Stop Long Poll')
      stopLongPoll()
      polling = false
    }
    else {
      logger('Restarting Long Poll')
      startLongPoll()
    }
  }

  // Stops polling the API
  function stopLongPoll () {
    logger('Stopping Long Poll')
    clearInterval(polling)
    polling = false
  }

  // When the component is added to the page, it calls onMount
  onMount(async () => {
    return Promise.all([
      // Have it first get the current count from the API
      getCount(),
      // Have it start long polling for changes
      startLongPoll()
    ])
  })

  // When the component leaves the page, it calls onDestroy
  onDestroy(async () => {
    return Promise.all([
      // Have it first get the current count from the API
      // toggleLongPoll()
    ])
  })
</script>

<svelte:options tag="covid-counter-frontend" immutable={true} />

<h1>Frontend of {location}</h1>

<h2>Current Count is { $count }</h2>
