export type Key = 'V'|'A'|'R'|'K';
export const questions = [
['When you are learning something new, you prefer to:', ['See a picture, diagram, or example.','Listen to someone explain it.','Read the instructions yourself.','Try it yourself and practise.']],
['Your teacher is explaining a difficult maths idea. What helps you most?', ['A diagram showing the idea.','The teacher explaining it step by step.','Written notes with rules and examples.','Solving an example yourself.']],
['You need to remember how to get somewhere. You would rather:', ['Look at a map.','Have someone tell you the directions.','Read the directions.','Go there and learn the route by doing it.']],
['When studying for a test, you usually like to:', ['Use charts, diagrams, or visual notes.','Talk about the topic with someone.','Read and write notes.','Practise questions and activities.']],
['You are learning how to use a new piece of technology. You would rather:', ['Watch someone demonstrate it.','Have someone explain how it works.','Read the instructions.','Try it yourself.']],
['Which classroom activity do you enjoy most?', ['Watching demonstrations or looking at diagrams.','Discussions and explanations.','Reading and writing activities.','Practical activities and experiments.']],
['You have to learn a new mathematical formula. What would help you most?', ['Seeing the formula in a diagram or worked example.','Hearing the teacher explain what each part means.','Writing the formula and its steps in your notebook.','Using the formula to solve several problems.']],
['When someone tells you about an interesting event, you prefer:', ['Seeing pictures of what happened.','Listening to them tell the story.','Reading about it.','Experiencing or acting it out.']],
['You do not understand a question in your homework. You are most likely to:', ['Look for an example or diagram.','Ask someone to explain it.','Read the question and notes again.','Start trying different ways to solve it.']],
['When you remember something you learned at school, you often remember:', ['What it looked like.','What the teacher or another student said.','Words or notes you read.','What you did when learning it.']],
['If you were learning about volcanoes, which activity would you choose?', ['Watch a video or look at diagrams.','Listen to an explanation or discussion.','Read an article or textbook section.','Make a model or do an experiment.']],
['You have a big project to complete. You prefer to:', ['Make posters, diagrams, or visual presentations.','Discuss your ideas with others.','Research, read, and write information.','Build, create, or demonstrate something.']],
['You need to learn a new word. What would help most?', ['See a picture showing its meaning.','Hear the word used in a sentence.','Write the word and its definition.','Use the word in an activity.']],
['In a maths lesson, you understand a new method best when you:', ['See a worked example on the board.','Hear the teacher talk through each step.','Have the steps written down.','Work through a problem yourself.']],
['For a revision session, you would rather:', ['Use a mind map or diagram.','Explain the topic to a friend.','Make written revision notes.','Do practice questions.']],
['If you had to explain something you know to a classmate, you would rather:', ['Draw it or show an example.','Talk them through it.','Write an explanation.','Show them by doing it.']],
['Which resource would you choose first?', ['An infographic.','A recorded explanation.','A textbook page.','An interactive activity.']],
['When learning a new sport or skill, you prefer to:', ['Watch someone do it first.','Listen to instructions.','Read the rules.','Practise it yourself.']],
['You are preparing a presentation. Which part do you enjoy most?', ['Designing the slides and visuals.','Explaining your ideas aloud.','Writing the information.','Creating a demonstration.']],
['Before an important test, what makes you feel most prepared?', ['Seeing a clear summary or diagram.','Discussing what you need to know.','Reading your notes carefully.','Practising questions.']],
] as const;
export const keys: Key[] = ['V','A','R','K'];
export const labels: Record<Key,string> = {V:'Visual',A:'Aural',R:'Read / Write',K:'Kinesthetic'};
