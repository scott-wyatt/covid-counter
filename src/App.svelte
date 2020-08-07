<script>
  import BackEnd from './BackEnd/BackEnd.svelte'
  import FrontEnd from './FrontEnd/FrontEnd.svelte'

  export let
    // If we should show the backend
    backend = false,
    // Set the location
    location = 'gorgous',
    // Credentials we can set for the backend
    credentials = false,
    // If we should log to console
    log = true

</script>

<svelte:options tag="covid-counter-app" immutable={true} />

{#if backend }
  <BackEnd {location} {credentials} {log}></BackEnd>
{:else}
  <FrontEnd {location} {log}></FrontEnd>
{/if}
