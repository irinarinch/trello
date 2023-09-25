import BoardController from './BoardController';
import DragController from './DragController';
import ListOfCards from './ListOfCards';

const list = new ListOfCards();
const dnd = new DragController();

const controller = new BoardController(list, dnd);

controller.init();
