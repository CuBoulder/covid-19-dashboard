<template>
    <div class="ucb-wc-header">
        <h2>Daily Summary - {{ today.toDateString() }}</h2>
        <p>updated: {{ getUpdatedTimeString() }}</p>
    </div>
    <div class="daily-stats-container">
        <section>
            <p>monitoring</p>
            <h3>{{ dailyResult.gsx$ofmonitoringtestsperformed.$t }}</h3>
        </section>
        <section>
            <p>pcr diagnostic tests completed</p>
            <h3>{{ dailyResult.gsx$ofpositiveresultsbymedicalservices.$t }}</h3>
        </section>
        <section>
            <p>positive pcr diagnostic test results</p>
            <h3>{{ dailyResult.gsx$ofpositiveresultsbymedicalservices.$t }}</h3>
        </section>
        <section>
            <p>on-campus isolation spaces in use</p>
            <h3>{{ dailyResult.gsx$utilizationrateofisolationspaces249.$t }}</h3>
        </section>
    </div>
    
    
</template>
<script>
export default {
    name: 'dailyTotals',
    props: {
        state: Object
    },
    
    setup(props){
        const today = new Date();
        const updatedDate = new Date(props.state.data.feed.updated.$t);
        const dailyResult = props.state.data.feed.entry[props.state.index];
        console.log(dailyResult);
        
        function getUpdatedTimeString() {
            let month = updatedDate.getMonth() + 1;
            let date = updatedDate.getDate();
            let year = updatedDate.getFullYear();
            let hour = updatedDate.getHours();
            let hours = hour > 12 ? hour - 12 : hour;
            let amORpm = hour < 12 ? 'AM' : 'PM';
            let minute = updatedDate.getMinutes();
            let minutes = minute < 10 ? '0' + minute.toString() : minute;

            return `${month}/${date}/${year} ${hours}:${minutes} ${amORpm}`;
        }

        return { today, updatedDate, getUpdatedTimeString, dailyResult };
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