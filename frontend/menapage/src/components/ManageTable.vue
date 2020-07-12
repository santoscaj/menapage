<template lang="pug">
.manage-main
  .table-container
    .navigation
      Button.back( @click="goBack()" type="primary" size="large" icon="md-arrow-back")
      Button.forward( @click="goToNext()" type="primary" size="large" icon="md-arrow-forward")
    Table.my-table(:columns="tableColumnsDynamic" :data="fotos")
      template( slot-scope="{row,index}" slot="position" )
        input.position.no-border( v-model="fotos[index].position" )
      template( slot-scope="{row,index}" slot="date" )
        input.date.no-border( v-model="fotos[index].date" )
      template( slot-scope="{row,index}" slot="image" )
        img.foto( :src="(fotoImg[row.id]) ? 'data:image/jpeg;charset=utf-8;base64,' + fotoImg[row.id] : basicImg" ) 
      template( slot-scope="{row,index}" slot="caption" )
        textarea.text.no-border( rows="5" cols="70" v-model="fotos[index].caption" )
      template( slot-scope="{row,index}" slot="action" )
        Button( @click="discardChanges(row.id)" type="error" icon="md-arrow-round-back" )
        Button( @click="saveChanges(row.id)" type="success" icon="md-checkmark" )
  Buttons
    
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import axios from 'axios'
import store from '@/store'
import Buttons from '@/components/Buttons.vue'
import {Message} from 'view-design'

@Component({components:{Buttons}})
export default class ManageTable extends Vue {

windowSize=700
basicImg='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD+f+iiigD/2Q=='

tableColumns = [
    { title: 'Image'    , key : 'foto'      , align: 'center' , slot:'image'    },
    { title: 'Caption'  , key : 'caption'   , align: 'center' , slot:'caption'  },
    { title: 'Date'     , key : 'date'      , align: 'center' , slot:'date'     },
    { title: 'Filename' , key : 'filename'  , align: 'center' ,                 },
    { title: 'Album'    , key : 'album'     , align: 'center'                   },
    { title: 'position' , key : 'position'  , align: 'center' , slot:'position' },
    { title: 'Action'   , key : 'action'    , align: 'center' , slot:'action'   , width: 120  }
    // { title: 'Guessed Year'     , key : 'guessed_year'           , align: 'center'    },
    // { title: 'Attempts Year'    , key : 'year_attempt_count'     , align: 'center'    },
    // { title: 'Date Year'        , key : 'year_attempt_date'      , align: 'center'    },
    // { title: 'Guessed Month'    , key : 'guessed_month'          , align: 'center'    },
    // { title: 'Attempts Month'   , key : 'month_attempt_count'    , align: 'center'    },
    // { title: 'Date Month'       , key : 'month_attempt_date'     , align: 'center'    },
  ]
  
  get tableColumnsDynamic(){
    if(this.windowSize<700)
      return this.tableColumns.filter(column=>['foto', 'filename', 'album'].includes(column.key))
    return this.tableColumns
  } 

  thisPage(){
    return this.$route.params.albumDay
  }

  goBack(){
    let current = Number(this.$route.params.albumDay)
    let path = this.$route.path.split('/')
    let next = current == 0 ? 31 : current - 1 
    path.pop()
    path.push(next.toString())
    window.location.pathname = path.join('/')
  }
  goToNext(){
    let current = Number(this.$route.params.albumDay)
    let path = this.$route.path.split('/')
    let next = current == 31 ? 0 : current + 1 
    path.pop()
    path.push(next.toString())
    window.location.pathname = path.join('/')
  }
  get albumDay(){
    return this.$route.params.albumDay
  }

  fotos = [{id: '' }]
  fotoImg = {}

  @Watch('thisPage')
  async getFotos(){
    try{
      let response = await axios.get(`${store.backendUrl}fotos_of_the_day/${this.albumDay}`)
      // @ts-ignore 
      this.fotos = response.data.map(foto=>({ ...foto, album: foto.album.dirname}) )
      
      for(let foto of this.fotos){
        try{
          let response = await axios.get(`${store.backendUrl}fotos/${foto.id}`,{responseType: 'arraybuffer'})
          // @ts-ignore
          this.fotoImg = { ... this.fotoImg, [foto.id]: Buffer.from(response.data, 'binary').toString('base64') }
        }catch(e){console.error(e)}
      }
      
    }catch(e){console.error(e)}
  }

  async created(){
    this.getFotos()
    window.onresize = ()=>{
      this.windowSize = window.innerWidth
    }
  }

  mounted(){
    document.documentElement.style.setProperty('--number-of-columns','10')
    document.querySelectorAll('.ivu-table-cell').forEach(cell=>{
      // @ts-ignore
      cell.style.wordWrap = 'break-word'
      // @ts-ignore
      cell.style.wordBreak = 'normal'
    })
  }
  async discardChanges(id:string){
    let index = this.fotos.findIndex(foto=>foto.id==id)
    try{
      if(!id) throw 'no id'
      let foto = this.fotos[index]
      let response = await axios.get(`${store.backendUrl}fotoinfo/${foto.id}`)
      this.fotos[index] = response.data
      // this.fotos.splice(index, 1, response.data )
      // @ts-ignore 
      Message.success('foto loaded successfully')
    }catch(e){
      console.error(e)
      // @ts-ignore 
      Message.error('error loading foto')
    }
  }

  async saveChanges(id:string){
    try{
      if(!id) throw 'no id'
      let index = this.fotos.findIndex(foto=>foto.id==id)
      let foto = this.fotos[index]
      let response = await axios.put(`${store.backendUrl}fotoinfo/${foto.id}`, foto)
      this.fotos[index] = response.data
      // this.fotos.splice(index, 1, response.data )
      // @ts-ignore 
      Message.success('foto saved successfully')
    }catch(e){
      console.error(e)
      // @ts-ignore 
      Message.error('Could not save picture')
    }
  }

}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="sass">

.manage-main
  display: flex
  flex-direction: column
  width: 100vw
  height: 100vh

.table-container
  padding: 20px
  overflow: auto
  flex: 1 1 auto

.foto
  max-width: 100px
  max-height: 100px
  display: block
  width: auto
  height: auto
  object-fit: cover  

.text
  width:100%
  height:100%

.no-border
  width: 100%
  height: 100%
  padding: 5px
.position
  text-align: center
  width: 40px

// .no-border, .no-border:focus, .no-border:hover
//   border: none, 
//   outline: none
//   background: transparent

.navigation
  width: 100%
  height: 50px
  display: flex
  justify-content: space-between
  &>*
    width: 60px


</style>


