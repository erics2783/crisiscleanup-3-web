<template>
  <div>
    <!-- SET CARD WIDTH TO 2/5 -->
    <div class="flex flex-row m-5 justify-between pt-3">
      <base-text variant="h3">Leaderboard</base-text>
      <!-- all time -->
      <div class="flex flex-col">
        <base-button
          icon-size="sm"
          size="sm"
          variant="outline"
          class="px-2"
          :action="() => (toggleOpen = !toggleOpen)"
          :ccu-icon="!toggleOpen ? 'down' : 'up'"
          >All Time</base-button
        >
        <!-- Other Options -->
        <div class="flex flex-col" v-if="toggleOpen">
          <base-text variant="h3">other</base-text>
          <base-text variant="h3">more</base-text>
        </div>
      </div>
    </div>
    <hr />
    <div class="flex flex-row justify-end">
      <div class="flex flex-col mx-24 pr-8 mt-2">
        <base-text variant="body" weight="300">Calls</base-text>
      </div>
    </div>
    <!-- Profiles -->
    <LeaderboardProfileCard />
  </div>
</template>

<script>
import LeaderboardProfileCard from './LeaderboardProfileCard';
export default {
  name: 'Leaderboard',
  components: {
    LeaderboardProfileCard,
  },
  data() {
    return {
      toggleOpen: false,
    };
  },
};
</script>
