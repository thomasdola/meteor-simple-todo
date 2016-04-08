import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Tasks } from '../api/tasks.js';
import { ReactiveDict } from 'meteor/reactive-dict';
import './task.js';
import './body.html';

Template.body.helpers({
    tasks(){
        const instance = Template.instance();
        if(instance.state.get('hideCompleted')){
            return Tasks.find({
                checked: {$ne: true}}
                ,{sort: {createdAt: -1}
            })
        }
        return Tasks.find(
            {}
            ,{sort: {createdAt: -1}}
        );
    },
    incompleteTasks(){
        return Tasks.find({
            checked: {$ne: true}
        }).count();
    }
});

Template.body.events({
    'submit form.new-task'(event, instance){
        event.preventDefault();
        const target = event.target;
        const text = target.text.value;
        if(text.trim())
        Meteor.call('tasks.insert', text);
        target.text.value = '';
    },
    'change .hide-completed input'(event, instance){
        instance.state.set('hideCompleted', event.target.checked);
    }
});

Template.body.onCreated(function bodyOnCreated() {
    this.state = new ReactiveDict();
    Meteor.subscribe('tasks');
});

Template.body.onRendered(function () {
    //add your statement here
});

Template.body.onDestroyed(function () {
    //add your statement here
});

