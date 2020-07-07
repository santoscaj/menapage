<template lang="pug">
  div
    ManageTable 
</template>

<script>
// @ is an alias to /src
import ManageTable from '@/components/ManageTable.vue'
import {Vue, Component} from 'vue-property-decorator'

@Component({components:{ManageTable}})
export default class ManagePage extends Vue {

}
</script>