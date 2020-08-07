<script>
  import { onMount, onDestroy } from 'svelte'

  import { getRequest, postRequest } from '../api'
  import { count } from '../stores'
  import Incrementer from './Incrementer.svelte'
  import Decrementer from './Decrementer.svelte'
  import Resetter from './Resetter.svelte'


  // The Props
  export let
    // This is the prop that can be imported from the webcomponent
    location = 'gorgous',
    // Credentials for the API
    credentials = false,
    // If we should log to console
    log = true

  // This will tell the page we are loading something
  let loading = true

  // We'll update this variable anytime there is an error
  let error = false

  // Set the pollTime to 30 seconds
  let pollTime = 30000

  // This will hold our poll timeout
  let polling = false

  // Log if allowed
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

  // Post a value to the API
  async function post (val) {
    // Set loading to true
    loading = true

    // Clear out the previous errors
    error = false

    let response
    try {
      // Call the POST request here
      response = await postRequest(val, location, credentials)
    }
    catch (err) {
      logger('Error posting val', err)
      error = err
    }

    // Set the loading to finished
    loading = false

    // Return what we get back, just for safety
    return response
  }


  async function postIncrement () {
    let p = await post({increment: 1})
    logger('Posted Increment')
    let c = await getCount()
    return c
  }

  async function postDecrement () {
    let p = await post({decrement: 1})
    logger('Posted Decrement')

    // Now get a fresh count
    let c = await getCount()
    return c
  }

  // Event handler from incrementer
  function incremented({ detail }) {
    logger(' I Am Incremented', detail)
    postIncrement()
  }

  // Event handler from decrementer
  function decremented({ detail }) {
    logger('I Am Decremented', detail)
    postDecrement()
  }

  // Probably don't need a resetter, but let's just set the count to zero and stop polling
  function reset() {
    updateCount(0)
    toggleLongPoll()
  }

  async function getCount () {
    // Change the loading state to true
    loading = true
    logger('Getting count...')

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

    logger('Got count!', count)
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
      // stopLongPoll()
    ])
  })

</script>

<svelte:options tag="covid-counter-backend" immutable={true} />

<h1>Backend of {location}</h1>


<!-- Wait for the first API call -->
{#if loading}
  <h2>Loading...</h2>
{:else if error }
  <pre> { error } </pre>
{:else}
<!-- Show the result when not loading -->
  <h2>The count is {$count}</h2>
{/if}

<Incrementer {loading} {error} on:increment={incremented} />
<Decrementer {loading} {error} on:decrement={decremented}/>
<Resetter {loading} {error} on:reset={reset}/>
