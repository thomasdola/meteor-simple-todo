import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'meteor/practicalmeteor:chai';
import { Tasks } from './tasks.js';

if(Meteor.isServer){
    describe('Tasks', () => {
        describe('methods', () => {
            const userId = Random.id();
            let taskId;
            beforeEach(() => {
                Tasks.remove({});
                taskId = Tasks.insert({
                    text: 'test task',
                    createdAd: new Date(),
                    owner: userId,
                    username: 'thomas'
                });
            });
            it('can delete owned task', () => {
                const deleteTask = Meteor.server.method_handlers['tasks.remove'];
                const invocation = {userId};
                deleteTask.apply('remove', [taskId]);
                assert.equal(Tasks.find().count(), 0);
            });
            it('can create a task', () => {
                const createTask = Meteor.server.method_handlers['tasks.insert'];
                const invocation = {userId};
                createTask.apply('insert', ['second test task']);
                assert.equal(Tasks.find().count(), 2);
            });
            it('can check a task', () => {
                const checkTask = Meteor.server.method_handlers['tasks.setChecked'];
                const task = Tasks.findOne({username: 'thomas'});
                checkTask.apply('setChecked', [task._id, true]);
                assert.equal(Tasks.findOne({username: 'thomas'}).checked, true);
            });
            it('can privatize a task', () => {
                const privateTask = Meteor.server.method_handlers['tasks.setPrivate'];
                const task = Tasks.findOne({username: 'thomas'});
                privateTask.apply('setPrivate', [task._id, true]);
                assert.equal(Tasks.findOne({username: 'thomas'}).private, true)
            })
        });
    });
}