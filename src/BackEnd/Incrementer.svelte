<script>
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

  export let loading = false, error = false

  function increment() {
    dispatch('increment', 1)
  }

</script>
<svelte:options tag="covid-counter-incrementer" immutable={true} />
<button on:click={increment} disabled="{loading || error}">
  +
</button>
