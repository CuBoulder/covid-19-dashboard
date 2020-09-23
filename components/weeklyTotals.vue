<template>
<h1>
    Totals by Week -
    <em>as of {{ state.today }}</em>
</h1>
<table class="ucb-weekly-table">
    <thead>
        <tr>
            <th>By Week</th>
            <th>Monitoring Tests</th>
            <th>Referred for PCR Diagnostic Testing*</th>
            <th>PCR Diagnostic Tests</th>
            <th>Positive On-Campus PCR Diagnostic Tests</th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="(curDate, index) in wEntries.dates" :key="index">
            <td>{{ curDate }}</td>
            <td>{{ wEntries.monitor[index] }}</td>
            <td>{{ wEntries.referred[index] }}</td>
            <td>{{ wEntries.pcr[index] }}</td>
            <td>{{ wEntries.positive[index] }}</td>
        </tr>
    </tbody>
    <tfoot>
        <tr>
            <th>Grand Total</th>
            <th>{{ monitorTotal }}</th>
            <th>{{ referredTotal }}</th>
            <th>{{ pcrTotal }}</th>
            <th>{{ positiveTotal }}</th>
        </tr>
    </tfoot>
</table>
</template>

<script>
import {
    onMounted,
    reactive,
    ref
} from "vue";
export default {
    name: "weeklyTotals",
    props: {
        state: Object,
    },
    setup(props) {
        const foobar = "Text Goes Here";
        const wEntries = reactive({
            dates: [],
            monitor: [],
            pcr: [],
            positive: [],
            referred: [],
        });
        const monitorTotal = ref(0);
        const pcrTotal = ref(0);
        const positiveTotal = ref(0);
        const referredTotal = ref(0);

        // load the data
        function loadEntries(data) {
            let {
                weekOf,
                weekSummary,
                daysOnGraph,
                index
            } = props.state;

            let dayCount = data.feed.entry.length;

            for (let i = 0; i < dayCount; i++) {
                let curDate = data.feed.entry[i].gsx$date.$t;
                if (curDate.includes("WEEK")) {
                    let endWeek = data.feed.entry[i - 1].gsx$date.$t;
                    let startWeek = data.feed.entry[i - 5].gsx$date.$t;
                    // convert these from the dd-mm-yy format to dd/mm format
                    let endWeekArray = endWeek.split("-");
                    let startWeekArray = startWeek.split("-");

                    wEntries.dates.push(
                        startWeekArray[0] +
                        "/" +
                        startWeekArray[1] +
                        " - " +
                        endWeekArray[0] +
                        "/" +
                        endWeekArray[1]
                    );
                    let curMonitor = data.feed.entry[i].gsx$ofmonitoringtestsperformed.$t;
                    monitorTotal.value += Number(curMonitor);
                    wEntries.monitor.push(curMonitor);
                    let curPCR =
                        data.feed.entry[i].gsx$ofpcrtestscompletedbymedicalservices.$t;
                    pcrTotal.value += Number(curPCR);
                    wEntries.pcr.push(curPCR);
                    let curPositive =
                        data.feed.entry[i].gsx$ofpositiveresultsbymedicalservices.$t;
                    positiveTotal.value += Number(curPositive);
                    wEntries.positive.push(curPositive);

                    // fake data placeholder
                    wEntries.referred.push(Math.floor(curPCR * 0.35));
                    referredTotal.value += Math.floor(curPCR * 0.35);
                }
            }
        }

        onMounted(() => {
            loadEntries(props.state.data);
        });

        return {
            foobar,
            wEntries,
            monitorTotal,
            pcrTotal,
            positiveTotal,
            referredTotal,
        };
    },
};
</script>

<style scoped>
h1 {
    font-size: 18px;
    background-color: black;
    color: white;
    padding: 0.25em;
}

table {
    border: none;
    width: 100%;
    font-size: 12px;
}

thead,
table th {
    background-color: white;
    font-weight: bolder;
    border-bottom: 1px solid #888;
    text-align: right;
    padding: 2px 2px 0 0;
}

tbody td {
    border: none;
    text-align: right;
}

tfoot,
tfoot th {
    background-color: black;
    color: white;
    font-weight: bolder;
    text-align: right;
    padding: 0.75em 0.5em;
}

table td:first-of-type,
table th:first-of-type {
    text-align: left;
    padding-left: 1em;
}
</style>
