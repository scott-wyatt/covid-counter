<script>

  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

  function reset() {
    dispatch('reset')
  }
</script>

<svelte:options tag="covid-counter-resetter" immutable={true} />

<button on:click={reset}>
  reset
</button>
