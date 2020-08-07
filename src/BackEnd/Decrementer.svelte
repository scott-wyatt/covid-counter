<script>
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

  export let loading = false, error = false

  function decrement() {
    dispatch('decrement', 1)
  }

</script>
<svelte:options tag="covid-counter-decrementer" immutable={true} />
<button on:click={decrement} disabled="{loading || error}">
  -
</button>
