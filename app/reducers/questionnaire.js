const initialState = {
    all: null,
    questionnaire: null
};

export default function questionnaire(state = initialState, action) {
    switch (action.type) {
        case 'QUESTIONNAIRES_SUCCESS':
            return { all: action.payload };
        case 'QUESTIONNAIRE_SUCCESS':
            return { questionnaire: action.payload };
        default:
            return state;
    }
}
