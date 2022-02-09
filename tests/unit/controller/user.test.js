const mockRequest = (objectBodyDatas) => {
    return {
        body: objectBodyDatas,
    };
};

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

let nextFunction = jest.fn(); 


describe('Add user', () => {

    it('Should create user', () => {

    });

});