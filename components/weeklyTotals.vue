<template>
<h1>
    Totals by Week -
    <em>as of {{ state.today }}</em>
</h1>
<p>Testing branch setup...</p>
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
    <tbody></tbody>
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

<style scoped></style>
