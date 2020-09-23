<template>
    <div class="ucb-wc-header">
        <h2>Daily Summary - {{ todayDate.toDateString() }}</h2>
        <p>updated: {{ getUpdatedTimeString() }}</p>
    </div>
    <div class="daily-stats-container">
        <section v-for="item in dailyData" :key="item">
            <p>{{ item.name }}</p>
            <h3>{{ item.data }}</h3>
        </section>
    </div>
    
    
</template>
<script>
import { ref } from 'vue';
export default {
    name: 'dailyTotals',
    props: {
        state: Object
    },
    
    setup(props){
            const todayDate = ref(new Date());
            const updatedDate = ref(new Date(props.state.data.feed.updated.$t));
            const dailyData = ref([
                {
                    name: 'screening tests monitored',
                    data: props.state.data.feed.entry[props.state.index].gsx$ofmonitoringtestsperformed.$t
                },
                {
                    name: 'pcr diagnostic tests completed',
                    data: props.state.data.feed.entry[props.state.index].gsx$ofpcrtestscompletedbymedicalservices.$t
                },
                {
                    name: 'positive pcr diagnostic test results',
                    data: props.state.data.feed.entry[props.state.index].gsx$ofpositiveresultsbymedicalservices.$t
                },
                {
                    name: 'on-campus isolation spaces in use',
                    data: props.state.data.feed.entry[props.state.index].gsx$utilizationrateofisolationspaces249.$t
                }
            ]);

        function getUpdatedTimeString() {
            let month = updatedDate.value.getMonth() + 1;
            let date = updatedDate.value.getDate();
            let year = updatedDate.value.getFullYear();
            let hour = updatedDate.value.getHours();
            let hours = hour > 12 ? hour - 12 : hour;
            let amORpm = hour < 12 ? 'AM' : 'PM';
            let minute = updatedDate.value.getMinutes();
            let minutes = minute < 10 ? '0' + minute.toString() : minute;

            return `${month}/${date}/${year} ${hours}:${minutes} ${amORpm}`;
        }

        return { todayDate, updatedDate, dailyData, getUpdatedTimeString };
    }
}
</script>
<style lang="scss" scoped>

    .ucb-wc-header{
        background-color: black;
        color: white;
        text-align: center;
        padding: 6px;
        margin: 0px;

        h2{
            font-size: 1.5rem;
            margin: 0;
        }
        p {
            font-size: .65rem;
        }
    }

    .daily-stats-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
        padding: 4px 0;

        section {
            width: 22%;
            padding: 8px;
            margin: 4px 0;
            border: 1px solid grey;
            text-align: center;

            p {
                text-transform: uppercase;
                font-size: .75rem;
                font-weight: 600;
            }
        }
    }

    @media screen and (max-width: 420px) {
        .daily-stats-container > section {
            width: 45%;
        }
    }
</style>