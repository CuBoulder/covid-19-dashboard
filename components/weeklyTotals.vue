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
        <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
    </tbody>
    <tfoot>
        <tr>
            <th>Grand Total</th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
        </tr>
    </tfoot>
</table>
</template>

<script>
export default {
    name: "weeklyTotals",
    props: {
        state: Object,
    },
    setup(props) {
        return;
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
}
</style>
