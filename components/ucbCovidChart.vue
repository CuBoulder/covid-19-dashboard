<template>
    <div class="ucb-wc-container">
        <div class="ucb-wc-header"> 
            <h1> {{dataOption}} </h1>
        </div>
        <div class="ucb-wc-desc">
            <p> {{description}} </p>
        </div>
        <div class="ucb-wc-data-container">
            <div class="ucb-wc-chart-container">
                <canvas :id="option" :aria-label="'Bar chart for ' + dataOption" role="img">
                    <p> This chart describes the {{dataOption}}.  </p>
                </canvas>
            </div>
            <div class="ucb-wc-stats">
                <div class="ucb-wc-child" v-if="/(On-Campus Isolation)/i.exec(dataOption)" :style="{borderColor: color }"> 
                    <h3> Utilization Rate </h3>
                    <h4> (Since September 22, 2020) </h4>
                    <p :style="{color: color}" class="supersize"> {{Math.floor(((stats.weekTotal/249).toFixed(2) * 100)) }} % </p> 
                </div>
                <div class="ucb-wc-child" v-else :style="{borderColor: color }"> 
                    <h3> Cumulative Total </h3>
                    <h4> (Since August 24, 2020)</h4>
                    <p :style="{color: color}" class="supersize"> {{stats.cumulativeTotal}} </p> 
                </div>
                <div class="ucb-wc-child" v-if="/(Monitoring Tests)/i.exec(dataOption)" style="borderColor: #2E7D32;"> 
                    <h3> Totals Public Health Referrals </h3>
                    <h4> (Since August 24, 2020) </h4> 
                    <p style="color: #2E7D32;" class="supersize"> {{stats.weekTotal}} </p> 
                </div>
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
        state: Object,
        color: String
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
        const stacked = reactive({
            data: [0,0,0,0,0],
            backgroundColor: '#2E7D32',
            borderWidth: 1
        });
        const description = ref(null);

        // format data and render the bar chart
        function renderChart(){
            let {weekOf, weekSummary, daysOnGraph, index, data} = props.state;
            let prev = (index - daysOnGraph +1);
            // only show 5 days at a time (M-F)
            for(let j=1; j<6; j++){
                if(j<= daysOnGraph){
                    // Add the data that exists
                    entries.data.push(+(data.feed.entry[prev])[option.value].$t);
                    entries.labels.push(data.feed.entry[prev].gsx$date.$t);
                    stats.weekTotal = stats.weekTotal + (+(data.feed.entry[prev])[option.value].$t);
                    stats.lastDayTotal = +(data.feed.entry[index])[option.value].$t;
                }
                else{
                    // show no data for future dates
                    entries.data.push(0);
                    entries.labels.push(data.feed.entry[index+(j - daysOnGraph)].gsx$date.$t);
                }
                prev++;
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
                    datasets: [ stacked ,{
                        data: entries.data,
                        backgroundColor: props.color,
                        borderWidth: 1
                    }]
                },
                options: {
                    tooltips:{
                        enabled: false,
                        custom: function(tooltipModel) {
                            // Tooltip Element
                            var tooltipEl = document.getElementById('chartjs-tooltip');
                            // Create element on first render
                            if (!tooltipEl) {
                                tooltipEl = document.createElement('div');
                                tooltipEl.id = 'chartjs-tooltip';
                                document.body.appendChild(tooltipEl);
                            }
                            // Hide if no tooltip
                            if (tooltipModel.opacity === 0) {
                                tooltipEl.style.opacity = 0;
                                return;
                            }
                            function getBody(bodyItem) {
                                return bodyItem.lines;
                            }
                            // Set Text
                            if (tooltipModel.body) {
                                let i = tooltipModel.dataPoints[0].index;
                                var innerHtml = `<div> <h4 style="font-size:1rem;"> Date: ${tooltipModel.title[0]} </h4> <h4> ${props.dataOption} : ${entries.data[i]} </h4>`;
                                if(props.dataOption === '# of Monitoring Tests Performed'){
                                    innerHtml += `<h4> Referred to Public Health for PCR Diagnostic Testing: ${stacked.data[i]} </h4>`;
                                }
                                tooltipEl.innerHTML = innerHtml + '</div>';
                            }
                            var position = this._chart.canvas.getBoundingClientRect();
                            tooltipEl.style.opacity = 1;
                            tooltipEl.style.position = 'absolute';
                            tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
                            tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
                            tooltipEl.style.backgroundColor = 'white';
                            tooltipEl.style.border = '1px solid grey';
                            tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
                            tooltipEl.style.pointerEvents = 'none';
                            tooltipEl.style.fontSize = '10px';
                        }
                    },
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
                            },
                            stacked: true
                        }],
                        xAxes:[{
                            scaleLabel:{
                                display: true,
                                labelString: '5 Day M-F'
                            },
                            stacked: true
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
                    stacked.data = props.state.publicHealthReferrals;
                    description.value = "Monitoring, also known as surveillance testing, is an important part of CU Boulder's health and safety response to COVID-19. Surveillance testing is a molecular, saliva-based PCR test that allows CU Boulder to identify potential cases of COVID-19 and inform control measures to help prevent outbreaks. Students living in a residence hall or an on-campus apartment are required to be screened once each week at a testing site near their residence hall. The appointment takes about two minutes and students are contacted via email if a diagnostic test is recommended. The university is working to expand this testing capability beyond on-campus residents.";
                    break;
                case '# of Positive Results by Medical Services':
                    option.value = 'gsx$ofpositiveresultsbymedicalservices';
                    description.value = "COVID-19 testing is available on campus for all students. Students with symptoms or students advised by the contact tracing team to seek testing&nbsp;can contact the Public Health Clinic&nbsp;to make an appointment for COVID-19 testing. Daily totals of PCR Diagnostic Tests administered include all tests conducted in the Public Health Clinic, not just those referred through monitoring. As part of campus monitoring and contact tracing, employees can be tested on campus if they are identified by a campus contact tracer as having been potentially exposed.";
                    break;
                case '# of PCR Tests Completed by Medical Services':
                    option.value = 'gsx$ofpcrtestscompletedbymedicalservices';
                    description.value = "COVID-19 testing is available on campus for all students. Students with symptoms or students advised by the contact tracing team to seek testing&nbsp;can contact the Public Health Clinic&nbsp;to make an appointment for COVID-19 testing. Daily totals of PCR Diagnostic Tests administered include all tests conducted in the Public Health Clinic, not just those referred through monitoring. As part of campus monitoring and contact tracing, employees can be tested on campus if they are identified by a campus contact tracer as having been potentially exposed.";
                    break;
                case 'On-Campus Isolation Usage':
                    option.value ='gsx$utilizationrateofisolationspaces249';
                    description.value = "On-campus residents with a need to isolate themselves due to a positive COVID-19 test result have the option to utilize space reserved on campus for isolation. Students receive guidance from the Public Health Clinic at CU Boulder if they are required to isolate. For more information visit the Public Health Clinic webpage. ";
                    break;
                default:
                    // error if a possible title isnt specified
                    console.error("Invalid option selected. No data to show");
                    return;
            }
        });

        onMounted(() => {
            renderChart();
        });

        return {stats, entries, option, description}
    }
}
</script>
<style lang="scss" scoped>
p{margin: 0px;}
h3{font-size: 100%;}
h4{ font-size: .75rem;}
.ucb-wc-container{
    margin: 2px;
    display: flex;
    flex-direction: column;
    justify-content:space-between;
}
.ucb-wc-container:last-child{
    flex: 1;
}
.ucb-wc-header{
    background-color: black;
    h1{
        color: white;
        font-size: 1rem;
        text-align: center;
        padding: 6px;
        margin: 0px;
        height: 50px;
    }
}

.ucb-wc-desc{
    background-color: $gray-light;
    padding: 12px;
    font-size: .75em;
    max-height: 250px;
}
.ucb-wc-chart-container{
    margin: .5em 0 .5em 0;
    height: 350px;
    flex: 0 0 auto;
}
.ucb-wc-data-container {
    display: flex;
    align-items: center;
    .ucb-wc-chart-container{
        width: 80%;
    }
    .ucb-wc-stats{
        width: 30%;
    }
    .ucb-wc-child{
        border: 1px solid grey;
        margin: 1em;
        padding: .25em;
        text-align: center;
    }
    @media (max-width:$breakpoint_xlarge){
        flex-wrap: wrap;
        .ucb-wc-stats{
            width: 100%;
        }
        .ucb-wc-chart-container{
            width: 100%;
        }
    }
}
</style>