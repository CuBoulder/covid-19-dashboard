<template>
    <div class="ucb-wc-container">
        <div class="ucb-wc-chart-container">
            <canvas :id="option" :aria-label="'Bar chart for ' + dataOption" role="img">
                <p> This chart describes the {{dataOption}}.  </p>
            </canvas>
        </div>
        <div class="ucb-wc-stats">
            <div class="ucb-wc-child"> <h3> {{new Date().toLocaleDateString() }} Total </h3> <p class="supersize"> {{stats.lastDayTotal}} </p> </div>
            <div class="ucb-wc-child"> <h3> Week of {{entries.labels[0]}} Total </h3> <p class="supersize"> {{stats.weekTotal}} </p>  </div>
            <div class="ucb-wc-child" v-if="/(On-Campus Isolation)/i.exec(dataOption)"> 
                <h3> Utilization Rate </h3> 
                <p class="supersize"> {{Math.floor(((stats.weekTotal/249).toFixed(2) * 100)) }} % </p> 
                <p> of 249 Total Spaces Used </p>
            </div>
            <div class="ucb-wc-child" v-else> 
                <h3> Cumulative Total </h3> 
                <p class="supersize"> {{stats.cumulativeTotal}} </p> 
                <p> August 24 - Present </p>0
            </div>
        </div>
    </div>
</template>
<script>
import { onMounted, reactive, onBeforeMount, ref } from 'vue';
import  Chart from 'chart.js';
export default {
    name: 'ucbCovidChart',
    props:{
        dataOption: String,
        data: Object
    },
    setup(props){
        const option = ref(null);
        const entries = reactive({
            labels: [],
            data: []
        });
        const stats = reactive({
            weekTotal: 0,
            lastDayTotal: 0,
            cumulativeTotal: 0
        });

        // format data and render the bar chart
        // @param {data} the response to sort
        function renderChart(data){
            let date = new Date().toLocaleDateString(); // mm/dd/yyyy
            date = date.replaceAll('/', '-'); // format date to mm-dd-yyyy
            let y = date.slice(-2); // last 2 digits of the year
            date = date.slice(0,5) + y; // mm-dd-yy
            let weekSummary, weekOf, daysOnGraph;
            weekSummary = weekOf = daysOnGraph = 0;
            for(let i=0; i< data.feed.entry.length; i++){
                if(data.feed.entry[i].gsx$date.$t === date){
                    weekOf = Math.floor(i/7) + 1;
                    weekSummary = (weekOf * 8) - 3; // index of the array that has the Week X summary row
                    daysOnGraph = 5 - (weekSummary - i - 1);
                    //console.log('Index is %d, Week of: %d, Weekly Summary Row Index: %d, # of days to graph: %d ', i, weekOf, weekSummary, daysOnGraph);
                    let prev = (i - daysOnGraph +1);
                    // only show 5 days at a time (M-F)
                    for(let j=1; j<6; j++){
                        if(j<= daysOnGraph){
                            // Add the data that exists
                            entries.data.push(+(data.feed.entry[prev])[option.value].$t);
                            entries.labels.push(data.feed.entry[prev].gsx$date.$t);
                            stats.weekTotal = stats.weekTotal + (+(data.feed.entry[prev])[option.value].$t);
                            stats.lastDayTotal = +(data.feed.entry[i])[option.value].$t;
                        }
                        else{
                            // show no data for future dates
                            entries.data.push(0);
                            entries.labels.push(data.feed.entry[i+(j - daysOnGraph)].gsx$date.$t);
                        }
                        prev++;
                    }
                    break;
                }
            }
            // calculate the overall totals
            for(let k = 1; k<=weekOf; k++){
                let s = (k * 8) - 3;
                stats.cumulativeTotal = stats.cumulativeTotal + (+(data.feed.entry[s])[option.value].$t);
            }

            // create a new chart
            new Chart(document.getElementById(option.value), {
                type: 'bar',
                data: {
                    labels: entries.labels, //always 5 days at time
                    datasets: [{
                        data: entries.data,
                        backgroundColor: 'rgba(207, 184, 124, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    legend: {
                        display: false
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            },
                            scaleLabel:{
                                display: true,
                                labelString: props.dataOption
                            }
                        }],
                        xAxes:[{
                            scaleLabel:{
                                display: true,
                                labelString: '5 Day M-F'
                            }
                        }]
                    },
                    title:{
                        display: true,
                        text: props.dataOption
                    },
                    maintainAspectRatio: false
                }
            });
        }

        onBeforeMount(()=>{
            // determine what chart to render
            switch(props.dataOption){
                case '# of Monitoring Tests Performed':
                    option.value = 'gsx$ofmonitoringtestsperformed';
                    break;
                case '# of Positive Results by Medical Services':
                    option.value = 'gsx$ofpositiveresultsbymedicalservices';
                    break;
                case '# of PCR Tests Completed by Medical Services':
                    option.value = 'gsx$ofpcrtestscompletedbymedicalservices';
                    break;
                case 'On-Campus Isolation Usage':
                    option.value ='gsx$utilizationrateofisolationspaces249';
                    break;
                default:
                    // error if a possible title isnt specified
                    console.error("Invalid option selected. No data to show");
                    return;
            }
        });

        onMounted(() => {
            renderChart(props.data);
        });

        return {stats, entries, option}
    }
}
</script>
<style lang="scss" scoped>
.ucb-wc-title{
    text-align: center;
    font-weight: bold;
}
.ucb-wc-container{
    display: flex;
    justify-content:space-between;
    align-items: center;
    @media screen and(max-width: $breakpoint_large){
      flex-direction: column;
      align-items: unset;
    }
}
.ucb-wc-chart-container{
    flex: 0 0 auto;
    height: 360px;
    width: 70%;
    @media screen and(max-width: $breakpoint_large){
        margin: auto;
    }
}
.ucb-wc-stats{
    display: flex;
    flex-direction: column;
}

.ucb-wc-child {
    border: 1px solid grey;
    min-height: 170px;
    max-width: 300px;
    margin-bottom: 1em;
    text-align: center;
    padding-top: .5em;
    @media screen and(max-width: $breakpoint_large){
      max-width: unset;
    }
}
p.supersize{
    font-size: 320%;
    font-weight: bold;
}
</style>