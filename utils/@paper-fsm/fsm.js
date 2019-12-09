import {Machine} from 'xstate'
import options from 'utils/@paper-fsm/options.js'
import schema from 'utils/@paper-fsm/schema.js'


const paperMachine = Machine(schema, options)


export default paperMachine
