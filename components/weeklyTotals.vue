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
            <td>Index is : {{ index }}</td>
            <td>{{ wEntries.pcr[index] }}</td>
            <td>{{ wEntries.positive[index] }}</td>
        </tr>
    </tbody>
    <tfoot>
        <tr>
            <th>Grand Total</th>
            <th>{{foobar}}</th>
            <th></th>
            <th></th>
            <th></th>
        </tr>
    </tfoot>
</table>
</template>

<script>
import {
    onMounted,
    reactive
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
        });

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
                wEntries.dates.push(curDate);
                let curMonitor = data.feed.entry[i].gsx$ofmonitoringtestsperformed.$t;
                wEntries.monitor.push(curMonitor);
                let curPCR =
                    data.feed.entry[i].gsx$ofpcrtestscompletedbymedicalservices.$t;
                wEntries.pcr.push(curPCR);
                let curPositive =
                    data.feed.entry[i].gsx$ofpositiveresultsbymedicalservices.$t;
                wEntries.positive.push(curPositive);
            }
        }

        onMounted(() => {
            loadEntries(props.state.data);
        });

        return {
            foobar,
            wEntries,
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
}

thead,
table th {
    background-color: white;
    font-size: 12px;
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
    padding: 0.25em 0;
}
</style>
