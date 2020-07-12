<template lang="pug">
div
  Table(:columns="tableColumns" :data="images")
    template( slot-scope="{row,index}" slot="action" )
      Button( @click="discardChanges()" type="error" icon="md-arrow-round-back" )
      Button( @click="saveChanges()" type="success" icon="md-checkmark" )
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class HelloWorld extends Vue {
tableColumns = [
    { title: 'Name'             , key : 'name'                   , align: 'center'    },
    { title: 'Message'          , key : 'message'                , align: 'center'    },
    { title: 'Date'             , key : 'date'                , align: 'center'    },
    { title: 'Album'            , key : 'album'                  , align: 'center'    },
    { title: 'index'            , key : 'position'               , align: 'center'    },
    { title: 'Guessed Year'     , key : 'guessed_year'           , align: 'center'    },
    { title: 'Attempts Year'    , key : 'year_attempt_count'     , align: 'center'    },
    { title: 'Date Year'        , key : 'year_attempt_date'      , align: 'center'    },
    { title: 'Guessed Month'    , key : 'guessed_month'          , align: 'center'    },
    { title: 'Attempts Month'   , key : 'month_attempt_count'    , align: 'center'    },
    { title: 'Date Month'       , key : 'month_attempt_date'     , align: 'center'    },
    {
      title:'Action',
      key: 'action',
      slot:'action',
      align: 'center',
      width: 120
    }
  ]

images = [{
  name    : 'name of image.jpg',
  id      : 'adsf-asfd-asdf-asfd',
  message : 'when we said our vows',
  date    : '2020-06-06',
  album   : 'wedding',
  order          : 1,
  guessed_year   :  false,
  guessed_month  :  false,
  year_attempt_count  : '',
  month_attempt_count : '',
  year_attempt_date   : '',
  month_attempt_date  : '',
  prize               : true
}]

  mounted(){
    document.querySelectorAll('.ivu-table-cell').forEach(cell=>{
      // @ts-ignore
      cell.style.wordWrap = 'break-word'
      // @ts-ignore
      cell.style.wordBreak = 'normal'
    })
  }
  discardChanges(){}
  saveChanges(){}

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="sass">
// .ivu-table-cell
//   word-break: normal !important
//   word-wrap: break-word !important
//   display: block !important
</style>
