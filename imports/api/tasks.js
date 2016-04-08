import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Tasks = new Mongo.Collection('tasks');

if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('tasks', function tasksPublication() {
        return Tasks.find({
            $or: [
                { private: { $ne: true } },
                { owner: this.userId },
            ],
        });
    });
}

Meteor.methods({
    'tasks.insert'(text){
        check(text, String);
        //if(! Meteor.userId()){
        //    throw new Meteor.Error("not-authorized");
        //}

        Tasks.insert({
            text,
            createdAt: new Date(),
            owner: 'testId',
            username: 'testUsername'
        });
    },
    'tasks.remove'(taskId){
        check(taskId, String);
        const task = Tasks.findOne(taskId);
        if (task.private && task.owner !== Meteor.userId()) {
            // If the task is private, make sure only the owner can delete it
            throw new Meteor.Error('not-authorized');
        }
        Tasks.remove(taskId);
    },
    'tasks.setChecked'(taskId, checked){
        check(taskId, String);
        check(checked, Boolean);
        const task = Tasks.findOne(taskId);
        if (task.private && task.owner !== Meteor.userId()) {
        //     If the task is private, make sure only the owner can check it off
            throw new Meteor.Error('not-authorized');
        }
        Tasks.update(taskId, {
            $set: {checked: checked}
        });
    },
    'tasks.setPrivate'(taskId, setToPrivate) {
        check(taskId, String);
        check(setToPrivate, Boolean);

        const task = Tasks.findOne(taskId);

        // Make sure only the task owner can make a task private
        //if (task.owner !== Meteor.userId()) {
        //    throw new Meteor.Error('not-authorized');
        //}

        Tasks.update(taskId, { $set: { private: setToPrivate } });
    },
});
