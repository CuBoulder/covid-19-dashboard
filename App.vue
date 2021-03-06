<template>
    <div id="ucb-wc-layout">
        <template v-if="state.data">
            <div class="ucb-wc-child ucb-wc-daily-totals"> 
                <dailyTotals :state="state"/>
            </div>
            <div class="ucb-wc-child ucb-wc-charts"> 
                <ucbCovidChart dataOption="# of Monitoring Tests Performed" :state="state" color="#cfb87c"/>
                <ucbCovidChart dataOption="# of Positive Results by Medical Services" :state="state" color="#000000"/>
                <ucbCovidChart dataOption="# of PCR Tests Completed by Medical Services" :state="state" color="#a6a6a6"/>
                <ucbCovidChart dataOption="On-Campus Isolation Usage" :state="state" color="#0277BD"/>
            </div>
            <div class="ucb-wc-child ucb-wc-weekly-totals"> 
                <weeklyTotals :state="state"/>
            </div>
            <div class="ucb-wc-child ucb-wc-note"> 
                <p>
                *Note: The molecular saliva-based PCR test used for monitoring tests has the advantage of being rapid, portable, and allows a large number of daily tests. 
                However, it has not been approved as a diagnostic test, and can yield both false positives and false negatives. 
                All students who test positive on the monitoring test are referred to the Public Health Clinic for PCR diagnostic tests.
                </p>
            </div>
        </template>
        <template v-else>
            Loading ...
        </template>
    </div>
</template>
<script>
import {reactive, onBeforeMount} from 'vue'
import ucbCovidChart from './components/ucbCovidChart';
import dailyTotals from './components/dailyTotals';
import weeklyTotals from './components/weeklyTotals';

/* 
* Spreadsheet
* @link https://docs.google.com/spreadsheets/d/1IF1JT4wzb38827Mklm0E2PEBnYekwN9l-Il0mChScsg/edit#gid=0
*/ 
export default {
    name: 'App',
    setup(){
        const state = reactive({
            data: null,
            weekSummary: 0,
            weekOf: 0,
            daysOnGraph: 0,
            today: null,
            index: 0,
            publicHealthReferrals: [1,2,3,4,5]
        });
        onBeforeMount(()=> {
            fetch('https://spreadsheets.google.com/feeds/list/1IF1JT4wzb38827Mklm0E2PEBnYekwN9l-Il0mChScsg/1/public/values?alt=json')
            .then(res => res.json())
            .then(res => {
                state.data = res;
                let date = new Date().toLocaleDateString(); // mm/dd/yyyy
                date = date.replaceAll('/', '-'); // format date to mm-dd-yyyy
                state.today = date.slice(0, date.length-2); // truncate the last two digits to get the mm-dd-yy
                for(let i=0; i< res.feed.entry.length; i++){
                    if(res.feed.entry[i].gsx$date.$t === state.today){
                        state.weekOf = Math.ceil(i/7);
                        state.weekSummary = (state.weekOf * 8) - 3; // index of the array that has the Week X summary row
                        state.daysOnGraph = 5 - (state.weekSummary - i - 1);
                        state.index = i;
                        console.log('Index is %d, Week of: %d, Weekly Summary Row Index: %d, # of days to graph: %d ', i, state.weekOf, state.weekSummary, state.daysOnGraph);
                        break;
                    }
                }
            })
            .catch(err => console.error(err));
        })
        return {state}
    },
    components: {ucbCovidChart, dailyTotals, weeklyTotals}
}
</script>
<style lang="scss" scoped>
.ucb-wc-note{
    background-color: $gray-light;
    padding: 20px;
}
.ucb-wc-child{
    margin-top: 1em;
}

#ucb-wc-layout{
    margin-top: 1em;
    margin-bottom: 1em;
}

</style>