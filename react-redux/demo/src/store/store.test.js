import expect from 'expect';
import { createStore } from 'redux';
import rootReducer from '../reducers/index';
import initialState from '../reducers/initialState';
import * as courseActions from '../actions/courseActions';

describe('Store', function() {
  it('Should handle creating and updating courses', function() {
    const store = createStore(rootReducer, initialState);
    const firstCourse = {
      id: 'clean-code',
      title: 'Clean Code'
    };
    const secondCourse = {
      id: 'architecture',
      title: 'Architecture'
    };

    //ACTIONS
    const firstAction = courseActions.createCourseSuccess(firstCourse);
    const secondAction = courseActions.createCourseSuccess(secondCourse);
    const updateAction = courseActions.updateCourseSuccess({id: 'architecture', title: 'Architecture Principles'});

    //DISPATCH ACTIONS
    store.dispatch(firstAction);
    store.dispatch(secondAction);
    store.dispatch(updateAction);


    const actual = store.getState().courses;
    const expected = [
      {id: 'clean-code', title: 'Clean Code'},
      {id: 'architecture', title: 'Architecture Principles'}
    ];
    expect(actual).toEqual(expected);
  });
});
