import db from '../database/connections';
import convertTime from '../utils/convert';
import {Request, Response} from 'express';

interface ScheduleItem{
    week_day: number;
    from: string;
    to: string;
}

export default class ClassesController{
    async index(request:Request, response:Response){
        const filter = request.query;

        if(!filter.subject || !filter.week_day || !filter.item){
            return response.status(400).json({
                error: 'Insira filtros de pesquisa'
            })
        }

        const timeInMinutes = convertTime(filter.time as string);

        const classes = await db('classes')
        .whereExists(function(){
            this.select('class_schedule.*')
            .from('class_schedule')
            .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
            .whereRaw('`class_schedule`.`week_day` = ??',[Number(filter.week_day as string)])
        })
        .where('classes.subject', "=",filter.subject as string)
        .join('users','classes.user_id', '=','users.id')
        .select(['classes.*','users.*']);

        return response.json(classes);
    }

    async create(request:Request, response:Response){
        const {name,avatar,whatsapp,bio,subject,cost,schedule} = request.body;
        const trx = await db.transaction();
    
       try {
    
        const usersCreated = await trx('users').insert({
             name,avatar,whatsapp,bio
         });
     
         const user_id = usersCreated[0];
     
         const createdClasses = await trx('classes').insert({
             subject,cost,user_id
         })
         
         const class_id = createdClasses[0];
         const classSchedule = schedule.map((item:ScheduleItem) =>{
             return {
                 class_id,
                 week_day: item.week_day,
                 from: convertTime(item.from),
                 to: convertTime(item.to),
             };
         })
     
         await trx('class_schedule').insert(classSchedule);
     
         await trx.commit();
     
         return response.status(201).send();
    
       } catch (error) {
        trx.rollback
         return response.status(400).json({
             error: 'Erro na inseção no banco de dados',
         })  
       }
    }
}