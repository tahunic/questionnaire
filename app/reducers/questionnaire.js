const initialState = {
    all: null,
    questionnaire: null,
    questionTypes: []
};

export default function questionnaire(state = initialState, action) {
    switch (action.type) {
        case 'QUESTIONNAIRES_SUCCESS':
            return { all: action.payload };
        case 'QUESTIONNAIRE_SUCCESS':
            return { questionnaire: action.payload };
        case 'QUESTION_TYPES_SUCCESS':
            return { questionTypes: action.payload };
        case 'QUESTIONNAIRE_FILL_SUCCESS':
            return { questionTypes: action.payload };
        default:
            return state;
    }
}
