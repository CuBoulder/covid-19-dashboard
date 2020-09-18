<template>
    <div id="grid-layout">
        <template v-if="state.data">
            <ucbCovidChart dataOption="On-Campus Isolation Usage" :data="state.data" />
        </template>
        <template v-else>
            Loading ...
        </template>
    </div>
</template>
<script>
import {reactive, onBeforeMount} from 'vue'
import ucbCovidChart from './components/ucbCovidChart';

/* 
* @link https://docs.google.com/spreadsheets/d/1IF1JT4wzb38827Mklm0E2PEBnYekwN9l-Il0mChScsg/edit#gid=0
*/ 
export default {
    name: 'App',
    setup(){
        const state = reactive({
            data: null
        });
        onBeforeMount(()=> {
            fetch('https://spreadsheets.google.com/feeds/list/1IF1JT4wzb38827Mklm0E2PEBnYekwN9l-Il0mChScsg/1/public/values?alt=json')
            .then(res => res.json())
            .then(res => state.data = res)
            .catch(err => console.error(err));
        })
        return {state}
    },
    components: {ucbCovidChart}
}
</script>